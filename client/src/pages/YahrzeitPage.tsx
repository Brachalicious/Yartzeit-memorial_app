import * as React from 'react';
import { useYahrzeit } from '@/hooks/useYahrzeit';
import { UpcomingYahrzeits } from '@/components/yahrzeit/UpcomingYahrzeits';
import { YahrzeitForm } from '@/components/yahrzeit/YahrzeitForm';
import { Card, CardContent } from '@/components/ui/card';

export function YahrzeitPage() {
  const { upcomingYahrzeits, loading, error, createEntry } = useYahrzeit();

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            Loading yahrzeit information...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center text-red-600">
            Error: {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Yahrzeit Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Track and remember the memorial dates of loved ones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <UpcomingYahrzeits yahrzeits={upcomingYahrzeits} />
        </div>
        
        <div>
          <YahrzeitForm onSubmit={createEntry} title="Quick Add Entry" />
        </div>
      </div>
    </div>
  );
}
