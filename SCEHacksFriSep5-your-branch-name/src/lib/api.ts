// src/lib/api.ts

// ========== Types ==========
export type Profile = {
  hackathon: string;
  name: string;
  contact: string;
  roles: string[];
  skills: string[];
  interests: string[];
  availability: string;
  blurb?: string;
};

export type Candidate = {
  name: string;
  contact: string;
  roles: string[];
  skills: string[];
  interests: string[];
  availability: string;
};

export type Match = {
  candidate: Candidate;
  score: number;
  explanation: string;
  ai_raw_response?: string;
};

// ========== API base ==========
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

// ========== Backend call ==========
/**
 * Send profile to backend and receive AI-evaluated matches.
 */
export async function fetchMatches(profile: Profile): Promise<Match[]> {
  const res = await fetch(`${API_BASE}/match_all`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.matches as Match[];
}

// ========== Re-exports ==========
/**
 * Export constants from mocks/seed.ts so UI components can import from lib/api.
 */
export {
  HACKATHONS,
  ROLES,
  SKILLS,
  INTERESTS,
  AVAILABILITY_OPTIONS,
} from "../mocks/seed";
