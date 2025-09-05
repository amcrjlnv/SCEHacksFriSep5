import os, json, re, hashlib
from typing import Any, Dict, List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from bson import ObjectId
import google.generativeai as genai

# =========================
# Env / Setup
# =========================
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

app = FastAPI(title="SCEHacks Backend", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # keep simple for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mongo (optional)
db = None
if MONGO_URI:
    try:
        client = AsyncIOMotorClient(MONGO_URI)
        db = client.hackathon
    except Exception:
        db = None  # fallback if connect fails

# Gemini (optional)
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    GEMINI_MODEL = genai.GenerativeModel(
        "gemini-1.5-flash", generation_config={"temperature": 0.7, "top_p": 0.9}
    )
else:
    GEMINI_MODEL = None

# =========================
# Seed
# =========================
SEED: List[Dict[str, Any]] = [
    {"hackathon": "SCE 2025", "name": "Ava", "contact": "@ava#1234",
     "roles": ["FE"], "skills": ["React", "Tailwind"], "interests": ["AI"],
     "availability": "Full weekend", "blurb": ""},
    {"hackathon": "SCE 2025", "name": "Ray", "contact": "@ray#4321",
     "roles": ["BE"], "skills": ["FastAPI", "Postgres"], "interests": ["Health"],
     "availability": "Evenings only", "blurb": ""},
    {"hackathon": "SCE 2025", "name": "Mia", "contact": "@mia#9999",
     "roles": ["ML/AI"], "skills": ["Python", "PyTorch"], "interests": ["Social Good"],
     "availability": "Flexible", "blurb": ""},
]

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
# Helpers
# =========================
def extract_json_block(text: str) -> Optional[str]:
    if not text:
        return None
    s = text.strip()
    fence_blocks = re.findall(r"```(?:json)?\s*([\s\S]*?)```", s, flags=re.IGNORECASE)
    if fence_blocks:
        s = fence_blocks[0].strip()

    start_idx = s.find("{")
    if start_idx == -1:
        return None

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
        return None

    candidate = s[start_idx:end_idx + 1].strip()
    return candidate.replace("“", '"').replace("”", '"')

def clean_mongo(x):
    """Convert Mongo ObjectId → str so FastAPI can JSON-encode"""
    if isinstance(x, ObjectId):
        return str(x)
    if isinstance(x, dict):
        return {k: clean_mongo(v) for k, v in x.items() if k != "_id"}
    if isinstance(x, list):
        return [clean_mongo(i) for i in x]
    return x

def apply_guardrails(profile: Profile, user: Dict[str, Any], score: int | float) -> int:
    roles_a = set(r.strip().upper() for r in profile.roles)
    roles_b = set(r.strip().upper() for r in user.get("roles", []))
    skills_a = set(s.strip().lower() for s in profile.skills)
    skills_b = set(s.strip().lower() for s in user.get("skills", []))

    same_role = len(roles_a & roles_b) > 0
    overlap_skills = len(skills_a & skills_b) > 0

    if same_role or overlap_skills:
        score = min(score, 30)
    else:
        score = max(score, 70)
    return int(max(0, min(100, round(score))))

def stable_jitter(a: str, b: str, spread: int = 3) -> int:
    h = hashlib.sha1(f"{a}|{b}".encode()).hexdigest()
    n = int(h[:4], 16)
    return (n % (2 * spread + 1)) - spread

# =========================
# Routes
# =========================
@app.get("/")
def root():
    return {"message": "Backend running 🚀"}

@app.post("/match_all")
async def match_all(profile: Profile):
    # Save submitter
    if db is not None:
        try:
            await db.participants.insert_one(profile.dict())
        except Exception:
            pass

    # Load pool
    if db is not None:
        try:
            pool = await db.participants.find(
                {"hackathon": profile.hackathon}
            ).to_list(200)
            pool = [clean_mongo(p) for p in pool] or SEED.copy()
        except Exception:
            pool = SEED.copy()
    else:
        pool = SEED.copy()

    results = []

    for user in pool:
        if user.get("name") == profile.name:
            continue

        if GEMINI_MODEL:
            prompt = f"""
You are scoring TEAM COMPLEMENTARITY between two hackathon participants.
DO NOT return text, markdown, or code fences — only valid JSON.

MANDATORY OUTPUT (exact keys, integers only 0–95):
{{
  "role_score": int,
  "skill_score": int,
  "interest_score": int,
  "availability_score": int,
  "overall_score": int,
  "scale_max": 95,
  "explanation": "short reason (<=160 chars)"
}}

STRICT RULES:
- SCALE: All scores must be in range 0–95 inclusive. Never use 96–100.
- OVERALL_SCORE: Arithmetic mean of the 4 sub-scores, rounded to nearest int.
- ROLES: Complementary roles (e.g., FE + BE) → HIGH (≥70). Overlapping roles → LOW (≤30).
- SKILLS: Complementary skills → HIGH (≥70). Overlapping skills → LOW (≤30).
- INTERESTS: Shared interests modestly raise score. Lack of overlap ≠ penalty.
- AVAILABILITY: Fully aligned schedules → HIGH. Partial overlap → mid. No overlap → LOW (≤30).
- EXPLANATION: One concise sentence (≤160 chars). No extra commentary.

USER_A: {profile.dict()}
USER_B: {user}
"""


            try:
                resp = GEMINI_MODEL.generate_content(prompt)
                ai_text = (resp.text or "").strip()
                extracted = extract_json_block(ai_text)
                r = s = i = a = 50
                explanation = "No explanation"
                if extracted:
                    parsed = json.loads(extracted)
                    r = int(parsed.get("role_score", 50))
                    s = int(parsed.get("skill_score", 50))
                    i = int(parsed.get("interest_score", 50))
                    a = int(parsed.get("availability_score", 50))
                    explanation = parsed.get("explanation", explanation)

                combined = round(0.30 * r + 0.45 * s + 0.15 * i + 0.10 * a)
                final_score = apply_guardrails(profile, user, combined)
                final_score = int(
                    max(0, min(100, final_score + stable_jitter(profile.name, user.get("name", ""))))
                )
            except Exception as e:
                ai_text, explanation, final_score = "", f"AI error: {e}", 0
        else:
            explanation, final_score, ai_text = "LLM disabled", 50, None

        candidate = {
            "name": user.get("name"),
            "contact": user.get("contact"),
            "roles": user.get("roles", []),
            "skills": user.get("skills", []),
            "interests": user.get("interests", []),
            "availability": user.get("availability"),
            "blurb": user.get("blurb", ""),
        }

        results.append(
            {
                "candidate": candidate,
                "score": final_score,
                "explanation": explanation,
                "ai_raw_response": ai_text,
            }
        )

    results.sort(key=lambda r: r["score"], reverse=True)
    return {"matches": results}
