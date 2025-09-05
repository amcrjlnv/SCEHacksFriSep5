import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ScoreBarProps {
  score: number;
  className?: string;
}

export function ScoreBar({ score, className }: ScoreBarProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return '[&>div]:bg-green-500';
    if (score >= 60) return '[&>div]:bg-yellow-500';
    return '[&>div]:bg-orange-500';
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Match Score</span>
        <span className={cn("text-sm font-bold", getScoreColor(score))}>
          {score}%
        </span>
      </div>
      <Progress 
        value={score} 
        className={cn("h-2", getProgressColor(score))}
        aria-label={`Match score: ${score}%`}
      />
    </div>
  );
}