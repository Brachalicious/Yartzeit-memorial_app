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
      <div className="text-center py-8 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent mb-2">
          ליועלי נשמת חיה שרה לאה בת אורי
        </h1>
        <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mb-3">
          Liulei Nishmas Chaya Sara Leah Bas Uri
        </h2>
        <p className="text-lg text-yellow-600 dark:text-yellow-400 italic">
          May her neshomoh have an aliyah
        </p>
      </div>

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
