import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpcomingYahrzeit } from '@/types/yahrzeit';
import { Calendar, Clock } from 'lucide-react';

interface UpcomingYahrzeitsProps {
  yahrzeits: UpcomingYahrzeit[];
}

export function UpcomingYahrzeits({ yahrzeits }: UpcomingYahrzeitsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysText = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  if (yahrzeits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Yahrzeits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">No upcoming yahrzeits in the next year.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Yahrzeits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {yahrzeits.slice(0, 10).map((yahrzeit) => (
          <div
            key={yahrzeit.id}
            className={`p-4 rounded-lg border ${
              yahrzeit.is_soon 
                ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20' 
                : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{yahrzeit.name}</h3>
                {yahrzeit.hebrew_name && (
                  <p className="text-sm text-muted-foreground">{yahrzeit.hebrew_name}</p>
                )}
                {yahrzeit.relationship && (
                  <p className="text-xs text-muted-foreground">{yahrzeit.relationship}</p>
                )}
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  yahrzeit.is_soon ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'
                }`}>
                  <Clock className="h-4 w-4" />
                  {getDaysText(yahrzeit.days_until)}
                </div>
              </div>
            </div>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Gregorian:</span> {formatDate(yahrzeit.yahrzeit_date)}
              </p>
              <p>
                <span className="font-medium">Hebrew:</span> {yahrzeit.hebrew_yahrzeit_date}
              </p>
            </div>
          </div>
        ))}
        
        {yahrzeits.length > 10 && (
          <p className="text-sm text-muted-foreground text-center">
            And {yahrzeits.length - 10} more...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
