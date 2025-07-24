import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Settings } from 'lucide-react';
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
          </div>
        </div>
      </div>
    </nav>
  );
}
