import os, json
from fastapi import FastAPI
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# MongoDB setup
client = AsyncIOMotorClient(MONGO_URI)
db = client.hackathon

# Gemini setup
genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI()

class Profile(BaseModel):
    hackathon: str
    name: str
    contact: str
    roles: list[str]
    skills: list[str]
    interests: list[str]
    availability: str
    blurb: str = ""


@app.get("/")
def root():
    return {"message": "Backend running 🚀"}


@app.post("/match")
async def match(profile: Profile):
    # Save user profile
    await db.participants.insert_one(profile.dict())

    # Fetch participants from same hackathon
    pool = await db.participants.find({"hackathon": profile.hackathon}).to_list(100)

    results = []
    for user in pool:
        if user["name"] == profile.name:
            continue

        # Hard guardrails: check overlap
        overlap_roles = set(profile.roles) & set(user["roles"])
        overlap_skills = set(profile.skills) & set(user["skills"])

        if overlap_roles or overlap_skills:  
            # If they share same role or same skills → bad match
            base_cap = 30
        else:
            # Complimentary by default
            base_cap = 100

        # Ask Gemini for JSON evaluation
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"""
        You are a strict evaluator for hackathon teammate compatibility.
        Always return valid JSON in this exact format:
        {{ "score": <integer>, "explanation": "<string>" }}

        Rules:
        - If users have the SAME roles or significant overlap in skills, score must be <= 30.
        - If they have DIFFERENT roles and different skills, score can be 70–100.
        - The explanation must be 1–2 sentences, short and clear.

        User A: {profile.dict()}
        User B: {user}
        """

        try:
            resp = model.generate_content(prompt)
            text = resp.text.strip()

            # Try to parse JSON, fallback to safe default
            parsed = json.loads(text)
            score = int(parsed.get("score", 0))
            explanation = parsed.get("explanation", "No explanation given")

            # Enforce guardrail cap
            if base_cap == 30 and score > 30:
                score = 30
            elif base_cap == 100 and score < 70:
                score = max(score, 70)

        except Exception as e:
            score, explanation = 0, f"AI error: {str(e)}"

        results.append({
            "name": user["name"],
            "contact": user["contact"],
            "roles": user["roles"],
            "skills": user["skills"],
            "interests": user["interests"],
            "availability": user["availability"],
            "score": score,
            "explanation": explanation
        })

    return {"matches": sorted(results, key=lambda x: x["score"], reverse=True)}
@app.post("/match_raw_all")
async def match_raw_all(profile: Profile):
    """
    For a submitted profile, compare against every other participant in the same hackathon.
    Return Gemini's raw JSON response per candidate WITHOUT parsing it.
    """
    # (Optional) Save the submitter; comment out if you don't want to store them yet.
    await db.participants.insert_one(profile.dict())

    # Fetch pool (same hackathon)
    pool = await db.participants.find({"hackathon": profile.hackathon}).to_list(100)

    model = genai.GenerativeModel("gemini-1.5-pro")  # or "gemini-1.5-flash" for cheaper/faster
    results = []

    for user in pool:
        # Skip self
        if user.get("name") == profile.name:
            continue

        # Hard guardrail hinting (the backend won't enforce caps here—just testing AI output)
        prompt = f"""
You are a strict evaluator for hackathon teammate compatibility.

OUTPUT FORMAT (VERY IMPORTANT):
- Output ONLY a single JSON object on ONE LINE.
- Do NOT include Markdown or code fences.
- Do NOT include any extra commentary.
- The JSON MUST be exactly: {{"score": <integer>, "explanation": "<string>"}}

SCORING RULES (enforced by YOU):
- If users have the SAME roles OR significant overlap in skills, "score" MUST be <= 30.
- If they have DIFFERENT roles AND different skills, "score" SHOULD be between 70 and 100.
- "explanation" MUST be 1–2 short sentences.

Compare these two participants:
User A (new): {profile.dict()}
User B (existing): {user}

Return exactly one line of JSON. No backticks. No prose. No extra keys.
"""

        try:
            resp = model.generate_content(prompt)
            ai_raw = (resp.text or "").strip()
        except Exception as e:
            ai_raw = f'{{"score":0,"explanation":"AI error: {str(e)}"}}'

        results.append({
            "candidate": {
                "name": user.get("name"),
                "contact": user.get("contact"),
                "roles": user.get("roles", []),
                "skills": user.get("skills", []),
                "interests": user.get("interests", []),
                "availability": user.get("availability")
            },
            "ai_raw_response": ai_raw
        })

    return {"results": results}
