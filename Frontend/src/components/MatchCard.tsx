import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Match } from "../lib/api";
import { toast } from "@/hooks/use-toast";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const copyContact = async () => {
    try {
      await navigator.clipboard.writeText(match.candidate.contact);
      toast({
        title: "Contact copied!",
        description: `Copied ${match.candidate.contact} to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the contact manually",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardContent className="p-6">
        {/* Header: name + availability */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
              {match.candidate.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{match.candidate.name}</h3>
              <p className="text-sm text-muted-foreground">
                {match.candidate.availability}
              </p>
            </div>
          </div>
          <div className="text-sm font-medium">Score: {match.score}</div>
        </div>

        {/* Roles */}
        <div className="mb-3">
          <p className="text-sm font-medium mb-2">Roles</p>
          <div className="flex flex-wrap gap-1">
            {match.candidate.roles.map((role) => (
              <Badge key={role} variant="secondary" className="text-xs">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-3">
          <p className="text-sm font-medium mb-2">Skills</p>
          <div className="flex flex-wrap gap-1">
            {match.candidate.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Explanation from AI */}
        <div className="mb-3">
          <p className="text-sm font-medium mb-1">Why you match</p>
          <p className="text-sm text-muted-foreground">{match.explanation}</p>
        </div>

        {/* Debug: raw AI response */}
        {match.ai_raw_response && (
          <details className="mt-2 text-xs text-muted-foreground">
            <summary>Raw AI response</summary>
            <pre className="whitespace-pre-wrap">{match.ai_raw_response}</pre>
          </details>
        )}
      </CardContent>

      <CardFooter className="pt-0 px-6 pb-6">
        <Button onClick={copyContact} className="w-full" variant="outline">
          <Copy className="h-4 w-4 mr-2" />
          Copy Contact
        </Button>
      </CardFooter>
    </Card>
  );
}
