import { Badge } from '@/components/ui/badge';
import { ROLES } from '../lib/api';

interface RoleChipsProps {
  value: string[];
  onChange: (value: string[]) => void;
  id?: string;
}

export function RoleChips({ value, onChange, id }: RoleChipsProps) {
  const toggleRole = (role: string) => {
    if (value.includes(role)) {
      onChange(value.filter(r => r !== role));
    } else {
      onChange([...value, role]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-labelledby={id}>
      {ROLES.map((role) => (
        <Badge
          key={role}
          variant={value.includes(role) ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors select-none"
          onClick={() => toggleRole(role)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleRole(role);
            }
          }}
        >
          {role}
        </Badge>
      ))}
    </div>
  );
}