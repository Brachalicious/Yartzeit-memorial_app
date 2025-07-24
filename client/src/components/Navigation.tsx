import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Settings, Heart, Flame, MessageCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Yahrzeit Tracker</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              asChild
              variant={location.pathname === '/yahrzeit' ? 'default' : 'ghost'}
              size="sm"
            >
              <Link to="/yahrzeit" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            
            <Button
              asChild
              variant={location.pathname === '/manage' ? 'default' : 'ghost'}
              size="sm"
            >
              <Link to="/manage" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Manage Entries
              </Link>
            </Button>

            <Button
              asChild
              variant={location.pathname === '/candle' ? 'default' : 'ghost'}
              size="sm"
            >
              <Link to="/candle" className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Light Candle
              </Link>
            </Button>

            <Button
              asChild
              variant={location.pathname === '/letters' ? 'default' : 'ghost'}
              size="sm"
            >
              <Link to="/letters" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Letters
              </Link>
            </Button>

            <Button
              asChild
              variant={location.pathname === '/learning' ? 'default' : 'ghost'}
              size="sm"
            >
              <Link to="/learning" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Learning
              </Link>
            </Button>

            <Button
              asChild
              variant={location.pathname === '/chat' ? 'default' : 'ghost'}
              size="sm"
            >
              <Link to="/chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Comfort
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
