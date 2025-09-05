import { useState, KeyboardEvent, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TokenInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  suggestions: string[];
  placeholder?: string;
  id?: string;
}

export function TokenInput({ 
  value, 
  onChange, 
  suggestions, 
  placeholder = "Type and press Enter",
  id 
}: TokenInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(
    suggestion => 
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) && 
      !value.includes(suggestion)
  );

  const addToken = (token: string) => {
    const trimmed = token.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeToken = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addToken(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeToken(value.length - 1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[2.5rem] bg-background">
        {value.map((token, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="flex items-center gap-1 text-sm"
          >
            {token}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => removeToken(index)}
              aria-label={`Remove ${token}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          id={id}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 border-0 shadow-none focus-visible:ring-0 min-w-[120px]"
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="border rounded-md bg-popover p-2 space-y-1 shadow-md">
          <p className="text-xs text-muted-foreground px-2 py-1">Suggestions:</p>
          <div className="flex flex-wrap gap-1">
            {filteredSuggestions.slice(0, 8).map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addToken(suggestion)}
                className="text-xs h-6 px-2"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}