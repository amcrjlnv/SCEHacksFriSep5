import { Moon, Sun, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function HeaderNav() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference and local storage
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">MatchMate</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="h-9 w-9"
        >
          {darkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle dark mode</span>
        </Button>
      </div>
    </header>
  );
}