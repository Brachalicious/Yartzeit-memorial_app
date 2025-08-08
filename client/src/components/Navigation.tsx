import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Settings, Heart, Flame, MessageCircle, BookOpen, ImageIcon, Building2, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between">
          
          {/* Title */}
          <div className="text-xl font-bold text-center sm:text-left">
            Yahrzeit Tracker
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-2">
            <NavButton to="/yahrzeit" active={location.pathname === '/yahrzeit'}>
              <Calendar className="h-4 w-4" />
              Dashboard
            </NavButton>

            <NavButton to="/manage" active={location.pathname === '/manage'}>
              <Settings className="h-4 w-4" />
              Manage Entries
            </NavButton>

            <NavButton to="/candle" active={location.pathname === '/candle'}>
              <Flame className="h-4 w-4" />
              Light Candle
            </NavButton>
            
            <NavButton to="/letters" active={location.pathname === '/letters'}>
              <Heart className="h-4 w-4" />
              Letters
            </NavButton>

            <NavButton to="/memorial" active={location.pathname === '/memorial'}>
              <ImageIcon className="h-4 w-4" />
              Upload Memories
            </NavButton>

            <NavButton to="/learning" active={location.pathname === '/learning'}>
              <BookOpen className="h-4 w-4" />
              Learning
            </NavButton>

            <NavButton to="/kotel-live" active={location.pathname === '/kotel-live'}>
              <Building2 className="h-4 w-4" />
              Kotel Live
            </NavButton>

            <NavButton to="/resources" active={location.pathname === '/resources'}>
              <Library className="h-4 w-4" />
              Resources
            </NavButton>

            <NavButton to="/chat" active={location.pathname === '/chat'}>
              <MessageCircle className="h-4 w-4" />
              Comfort
            </NavButton>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Reusable NavButton component
function NavButton({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Button asChild variant={active ? 'default' : 'ghost'} size="sm">
      <Link to={to} className="flex items-center gap-2">
        {children}
      </Link>
    </Button>
  );
}
