import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ArrowLeft, Filter, Settings, Search } from 'lucide-react';
import { MatchCard } from '../components/MatchCard';
import { EmptyState } from '../components/EmptyState';
import { MatchForm } from './MatchForm';
import { Match, storage } from '../lib/storage';
import { Badge } from '@/components/ui/badge';
import { ROLES } from '../lib/api';
import { useEffect, useState } from "react";
import type { Match } from "../lib/api";

export default function Results() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("mm.latestMatches");
    if (raw) setMatches(JSON.parse(raw));
  }, []);

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">Top Matches</h1>
      {matches.length === 0 && <p>No matches yet. Try submitting your profile.</p>}
      {matches.map((m, i) => (
        <div key={i} className="rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{m.candidate.name}</div>
              <div className="text-sm text-gray-500">{m.candidate.roles.join(", ")} • {m.candidate.skills.join(", ")}</div>
              <div className="text-sm">Score: <strong>{m.score}</strong></div>
            </div>
            <button
              className="text-sm underline"
              onClick={() => navigator.clipboard.writeText(m.candidate.contact)}
            >
              Copy contact
            </button>
          </div>
          <p className="mt-2 text-sm">{m.explanation}</p>
        </div>
      ))}
    </div>
  );
}

type SortOption = 'score' | 'skills' | 'interests';

export function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [hackathon, setHackathon] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('score');
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [refineOpen, setRefineOpen] = useState(false);

  useEffect(() => {
    // Try to get matches from navigation state first, then from localStorage
    const stateMatches = location.state?.matches;
    const stateHackathon = location.state?.hackathon;
    
    if (stateMatches && stateHackathon) {
      setMatches(stateMatches);
      setHackathon(stateHackathon);
    } else {
      // Fall back to localStorage
      const storedMatches = storage.getMatches();
      const storedProfile = storage.getProfile();
      
      if (storedMatches.length > 0 && storedProfile) {
        setMatches(storedMatches);
        setHackathon(storedProfile.hackathon);
      } else {
        // No matches found, redirect to match form
        navigate('/match');
      }
    }
  }, [location.state, navigate]);

  const filteredAndSortedMatches = useMemo(() => {
    let filtered = matches;

    // Apply role filter
    if (roleFilter.length > 0) {
      filtered = filtered.filter(match => 
        match.roles.some(role => roleFilter.includes(role))
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'skills':
          return b.skills.length - a.skills.length;
        case 'interests':
          return b.interests.length - a.interests.length;
        default:
          return 0;
      }
    });

    return sorted;
  }, [matches, sortBy, roleFilter]);

  const toggleRoleFilter = (role: string) => {
    setRoleFilter(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/match">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Form
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Top Matches for {hackathon}</h1>
          <p className="text-muted-foreground">
            {filteredAndSortedMatches.length} teammate{filteredAndSortedMatches.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="skills">Skills</SelectItem>
                <SelectItem value="interests">Interests</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Refine Search Sheet */}
          <Sheet open={refineOpen} onOpenChange={setRefineOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Refine
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Refine Your Search</SheetTitle>
                <SheetDescription>
                  Update your preferences to find better matches
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <MatchForm />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Filters */}
      {ROLES.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by roles:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((role) => (
              <Badge
                key={role}
                variant={roleFilter.includes(role) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => toggleRoleFilter(role)}
              >
                {role}
              </Badge>
            ))}
            {roleFilter.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRoleFilter([])}
                className="text-xs"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {filteredAndSortedMatches.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {filteredAndSortedMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <EmptyState onRefine={() => setRefineOpen(true)} />
      )}

      
    </div>
  );
}
