import { Badge } from '@/components/ui/badge';
import { INTERESTS } from '../lib/api';

interface InterestChipsProps {
  value: string[];
  onChange: (value: string[]) => void;
  id?: string;
}

export function InterestChips({ value, onChange, id }: InterestChipsProps) {
  const toggleInterest = (interest: string) => {
    if (value.includes(interest)) {
      onChange(value.filter(i => i !== interest));
    } else {
      onChange([...value, interest]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-labelledby={id}>
      {INTERESTS.map((interest) => (
        <Badge
          key={interest}
          variant={value.includes(interest) ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors select-none"
          onClick={() => toggleInterest(interest)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleInterest(interest);
            }
          }}
        >
          {interest}
        </Badge>
      ))}
    </div>
  );
}