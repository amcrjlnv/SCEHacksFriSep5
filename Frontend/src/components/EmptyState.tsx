import { Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onRefine?: () => void;
}

export function EmptyState({ onRefine }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <Users className="h-12 w-12 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">No matches found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        We couldn't find any teammates that match your criteria. Try adding more skills or interests to broaden your search.
      </p>
      
      {onRefine && (
        <Button onClick={onRefine} variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Refine Search
        </Button>
      )}
    </div>
  );
}