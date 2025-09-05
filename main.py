import os, json, re
from typing import Any, Dict, List, Optional

from fastapi import FastAPI
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import google.generativeai as genai

# =========================
# Setup
# =========================
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

client = AsyncIOMotorClient(MONGO_URI)
db = client.hackathon

genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="SCEHacks Backend", version="1.0.0")


# =========================
# Models
# =========================
class Profile(BaseModel):
    hackathon: str
    name: str
    contact: str
    roles: List[str]
    skills: List[str]
    interests: List[str]
    availability: str
    blurb: str = ""


# =========================
# Helpers: JSON extraction & guardrails
# =========================
def extract_json_block(text: str) -> Optional[str]:
    """
    Try very hard to extract a valid JSON object string from arbitrary model output.
    Handles:
      - ```json ... ``` fences
      - ``` ... ``` fences
      - Leading/trailing prose
      - Multiple code blocks
      - Picks the first balanced {...} block
    Returns the JSON substring or None.
    """
    if not text:
        return None

    s = text.strip()

    # 1) Strip code fences if present
    # ```json\n{...}\n``` or ```\n{...}\n```
    fence_blocks = re.findall(r"```(?:json)?\s*([\s\S]*?)```", s, flags=re.IGNORECASE)
    if fence_blocks:
        # Use the first fenced block content
        s = fence_blocks[0].strip()

    # 2) If there's still multiple text, try to find the first balanced JSON object
    # Find the first '{' and then balance braces
    start_idx = s.find("{")
    if start_idx == -1:
        # Maybe the whole thing is already a flat JSON line (rare), else bail
        return None

    # Scan forward to find matching closing brace using a stack
    depth = 0
    end_idx = -1
    for i in range(start_idx, len(s)):
        if s[i] == "{":
            depth += 1
        elif s[i] == "}":
            depth -= 1
            if depth == 0:
                end_idx = i
                break

    if end_idx == -1:
        # Not balanced
        return None

    candidate = s[start_idx:end_idx + 1].strip()

    # 3) Basic sanitation of smart quotes (rare from Gemini), keep double quotes JSON
    candidate = candidate.replace("“", '"').replace("”", '"').replace("’", "'").replace("‘", "'")

    return candidate


def apply_guardrails(profile: Profile, user: Dict[str, Any], score: int) -> int:
    """
    Enforce hard rules on the numeric score:
      - If SAME roles OR significant overlap in skills => cap <= 30
      - If DIFFERENT roles AND different skills => ensure >= 70 (raise floor to 70 if AI went low)
    Everything else: leave as-is but clamp to [0, 100].
    """
    roles_a = set([r.strip().upper() for r in profile.roles])
    roles_b = set([r.strip().upper() for r in user.get("roles", [])])
    skills_a = set([s.strip().lower() for s in profile.skills])
    skills_b = set([s.strip().lower() for s in user.get("skills", [])])

    same_role = len(roles_a & roles_b) > 0
    overlap_skills = len(skills_a & skills_b) > 0

    # SAME stack/role => cap at 30
    if same_role or overlap_skills:
        score = min(score, 30)
    else:
        # DIFFERENT roles + different skills => encourage high
        score = max(score, 70)

    # Clamp
    score = max(0, min(100, score))
    return score


# =========================
# Health
# =========================
@app.get("/")
def root():
    return {"message": "Backend running 🚀"}


# =========================
# Core: Compare against all users & parse AI JSON
# =========================
@app.post("/match_all")
async def match_all(profile: Profile):
    """
    - Saves the submitted profile (so they become part of the pool).
    - Fetches every other participant in the same hackathon.
    - For each candidate, asks Gemini to return JSON: {"score": <int>, "explanation": "<str>"}.
    - Robustly parses the AI output (handles code fences, prose, etc.).
    - Applies guardrails to the AI score.
    - Returns a clean list sorted by score.
    """
    # Save the submitter
    await db.participants.insert_one(profile.dict())

    # Pool from same hackathon
    pool = await db.participants.find({"hackathon": profile.hackathon}).to_list(100)

    model = genai.GenerativeModel("gemini-1.5-flash")  # cheaper/faster; switch to -pro if needed
    results = []

    for user in pool:
        if user.get("name") == profile.name:
            continue

        # Build strict prompt
        prompt = f"""
You are a strict evaluator for hackathon teammate compatibility.

OUTPUT FORMAT (MANDATORY):
- Output ONLY a single JSON object.
- NO markdown, NO code fences, NO extra keys, NO extra prose.
- EXACT SHAPE: {{"score": <integer>, "explanation": "<string>"}}

SCORING RULES (MANDATORY):
- If users have the SAME roles OR significant overlap in skills, "score" MUST be <= 30.
- If they have DIFFERENT roles AND different skills, "score" SHOULD be between 70 and 100.
- "explanation" MUST be 1–2 short sentences.

User A (new): {profile.dict()}
User B (existing): {user}

Return ONLY the JSON object on one line.
"""

        # 1) Call Gemini
        try:
            resp = model.generate_content(prompt)
            ai_text = (resp.text or "").strip()
        except Exception as e:
            results.append({
                "candidate": {
                    "name": user.get("name"),
                    "contact": user.get("contact"),
                    "roles": user.get("roles", []),
                    "skills": user.get("skills", []),
                    "interests": user.get("interests", []),
                    "availability": user.get("availability"),
                },
                "score": 0,
                "explanation": f"AI error: {str(e)}",
                "ai_raw_response": None
            })
            continue

        # 2) Extract & parse JSON safely
        parsed_score = 0
        parsed_expl = "No explanation"
        extracted = extract_json_block(ai_text)

        if extracted:
            try:
                parsed = json.loads(extracted)
                # Be defensive about types/keys
                if isinstance(parsed, dict):
                    if "score" in parsed:
                        try:
                            parsed_score = int(parsed["score"])
                        except Exception:
                            parsed_score = 0
                    if "explanation" in parsed and isinstance(parsed["explanation"], str):
                        parsed_expl = parsed["explanation"].strip() or "No explanation"
            except Exception as e:
                # If parsing fails, keep the raw text
                parsed_score = 0
                parsed_expl = f"AI parsing error: {str(e)}"
        else:
            parsed_expl = "AI returned no JSON object"

        # 3) Apply hard guardrails to the score (clip/floor)
        final_score = apply_guardrails(profile, user, parsed_score)

        # 4) Collect result
        results.append({
            "candidate": {
                "name": user.get("name"),
                "contact": user.get("contact"),
                "roles": user.get("roles", []),
                "skills": user.get("skills", []),
                "interests": user.get("interests", []),
                "availability": user.get("availability"),
            },
            "score": final_score,
            "explanation": parsed_expl,
            "ai_raw_response": extracted if extracted else ai_text  # keep for debugging/QA
        })

    # Sort descending by score
    results.sort(key=lambda r: r["score"], reverse=True)
    return {"matches": results}
