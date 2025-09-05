export interface UserProfile {
  hackathon: string;
  name: string;
  contact: string;
  roles: string[];
  skills: string[];
  interests: string[];
  availability: string;
  blurb: string;
}

export interface Match {
  id: string;
  name: string;
  roles: string[];
  skills: string[];
  interests: string[];
  contact: string;
  score: number;
  why: string[];
  blurb: string;
  availability: string;
}

const STORAGE_KEYS = {
  LAST_PROFILE: 'mm.lastProfile',
  LATEST_MATCHES: 'mm.latestMatches',
  SAVED_MATCHES: 'mm.savedMatches',
} as const;

export const storage = {
  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.LAST_PROFILE, JSON.stringify(profile));
  },

  getProfile: (): UserProfile | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_PROFILE);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  saveMatches: (matches: Match[]) => {
    localStorage.setItem(STORAGE_KEYS.LATEST_MATCHES, JSON.stringify(matches));
  },

  getMatches: (): Match[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LATEST_MATCHES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveFavorite: (matchId: string) => {
    const saved = storage.getSavedMatches();
    if (!saved.includes(matchId)) {
      saved.push(matchId);
      localStorage.setItem(STORAGE_KEYS.SAVED_MATCHES, JSON.stringify(saved));
    }
  },

  removeFavorite: (matchId: string) => {
    const saved = storage.getSavedMatches().filter(id => id !== matchId);
    localStorage.setItem(STORAGE_KEYS.SAVED_MATCHES, JSON.stringify(saved));
  },

  getSavedMatches: (): string[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_MATCHES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  isSaved: (matchId: string): boolean => {
    return storage.getSavedMatches().includes(matchId);
  }
};