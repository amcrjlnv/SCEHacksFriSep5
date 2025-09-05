import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Heart } from 'lucide-react';
import { Match } from '../lib/storage';
import { ScoreBar } from './ScoreBar';
import { toast } from '@/hooks/use-toast';
import { storage } from '../lib/storage';
import { useState } from 'react';

interface MatchCardProps {
  match: Match;
  onSaveToggle?: (matchId: string, saved: boolean) => void;
}

export function MatchCard({ match, onSaveToggle }: MatchCardProps) {
  const [isSaved, setIsSaved] = useState(storage.isSaved(match.id));

  const copyContact = async () => {
    try {
      await navigator.clipboard.writeText(match.contact);
      toast({
        title: "Contact copied!",
        description: `Copied ${match.contact} to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the contact manually",
        variant: "destructive",
      });
    }
  };

  const toggleSave = () => {
    const newSaved = !isSaved;
    setIsSaved(newSaved);
    
    if (newSaved) {
      storage.saveFavorite(match.id);
      toast({
        title: "Saved!",
        description: `${match.name} has been saved to your favorites`,
      });
    } else {
      storage.removeFavorite(match.id);
      toast({
        title: "Removed",
        description: `${match.name} has been removed from favorites`,
      });
    }
    
    onSaveToggle?.(match.id, newSaved);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
              {match.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{match.name}</h3>
              <p className="text-sm text-muted-foreground">{match.availability}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSave}
            className={isSaved ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            <span className="sr-only">{isSaved ? 'Remove from favorites' : 'Add to favorites'}</span>
          </Button>
        </div>

        <ScoreBar score={match.score} className="mb-4" />

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Roles</p>
            <div className="flex flex-wrap gap-1">
              {match.roles.map((role) => (
                <Badge key={role} variant="secondary" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Top Skills</p>
            <div className="flex flex-wrap gap-1">
              {match.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {match.why.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Why you match</p>
              <div className="flex flex-wrap gap-1">
                {match.why.map((reason, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {reason}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground">{match.blurb}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 px-6 pb-6">
        <Button 
          onClick={copyContact} 
          className="w-full" 
          variant="outline"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Contact
        </Button>
      </CardFooter>
    </Card>
  );
}