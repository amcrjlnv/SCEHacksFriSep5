import { UserProfile, Match } from './storage';
import { mockUsers, MockUser } from '../mocks/seed';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Calculate skill overlap score
const calculateSkillOverlap = (userSkills: string[], candidateSkills: string[]): number => {
  const overlap = userSkills.filter(skill => candidateSkills.includes(skill));
  return overlap.length / Math.max(userSkills.length, candidateSkills.length, 1);
};

// Calculate role complementarity score
const calculateRoleScore = (userRoles: string[], candidateRoles: string[]): number => {
  const overlap = userRoles.filter(role => candidateRoles.includes(role));
  const complementary = userRoles.length + candidateRoles.length - overlap.length;
  
  // Reward both overlap and complementarity
  const overlapScore = overlap.length / Math.max(userRoles.length, 1);
  const complementaryScore = complementary / 7; // Max possible roles
  
  return (overlapScore * 0.4) + (complementaryScore * 0.6);
};

// Calculate interest overlap score
const calculateInterestOverlap = (userInterests: string[], candidateInterests: string[]): number => {
  const overlap = userInterests.filter(interest => candidateInterests.includes(interest));
  return overlap.length / Math.max(userInterests.length, candidateInterests.length, 1);
};

// Generate match reasons
const generateMatchReasons = (user: UserProfile, candidate: MockUser): string[] => {
  const reasons: string[] = [];
  
  // Skill overlap
  const sharedSkills = user.skills.filter(skill => candidate.skills.includes(skill));
  if (sharedSkills.length > 0) {
    reasons.push(`${sharedSkills.length} shared skills: ${sharedSkills.slice(0, 3).join(', ')}`);
  }
  
  // Role complementarity
  const sharedRoles = user.roles.filter(role => candidate.roles.includes(role));
  const uniqueRoles = candidate.roles.filter(role => !user.roles.includes(role));
  
  if (sharedRoles.length > 0) {
    reasons.push(`Same roles: ${sharedRoles.join(', ')}`);
  }
  if (uniqueRoles.length > 0) {
    reasons.push(`Complementary roles: ${uniqueRoles.slice(0, 2).join(', ')}`);
  }
  
  // Interest overlap
  const sharedInterests = user.interests.filter(interest => candidate.interests.includes(interest));
  if (sharedInterests.length > 0) {
    reasons.push(`Shared interests: ${sharedInterests.join(', ')}`);
  }
  
  // Availability
  if (user.availability === candidate.availability) {
    reasons.push(`Same availability: ${user.availability}`);
  }
  
  return reasons;
};

export const getMatches = async (profile: UserProfile): Promise<Match[]> => {
  // Simulate API delay
  await delay(600);
  
  const candidates = mockUsers[profile.hackathon] || [];
  const matches: Match[] = [];
  
  for (const candidate of candidates) {
    // Skip if same name (assume it's the user)
    if (candidate.name.toLowerCase() === profile.name.toLowerCase()) {
      continue;
    }
    
    // Calculate individual scores
    const skillScore = calculateSkillOverlap(profile.skills, candidate.skills);
    const roleScore = calculateRoleScore(profile.roles, candidate.roles);
    const interestScore = calculateInterestOverlap(profile.interests, candidate.interests);
    
    // Weighted final score (skills: 60%, roles: 25%, interests: 15%)
    const finalScore = Math.round(
      (skillScore * 0.6 + roleScore * 0.25 + interestScore * 0.15) * 100
    );
    
    // Only include matches with score > 20
    if (finalScore > 20) {
      matches.push({
        id: candidate.id,
        name: candidate.name,
        roles: candidate.roles,
        skills: candidate.skills,
        interests: candidate.interests,
        contact: candidate.contact,
        score: finalScore,
        why: generateMatchReasons(profile, candidate),
        blurb: candidate.blurb,
        availability: candidate.availability
      });
    }
  }
  
  // Sort by score (highest first) and return top 5
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};
// src/lib/api.ts
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

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

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

// Export types and constants for use in components
export { HACKATHONS, ROLES, SKILLS, INTERESTS, AVAILABILITY_OPTIONS } from '../mocks/seed';
