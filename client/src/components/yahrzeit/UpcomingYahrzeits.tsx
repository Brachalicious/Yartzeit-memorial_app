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
      <Card className="bg-sky-100 border-sky-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-amber-600 via-blue-600 to-amber-600 bg-clip-text text-transparent">
            <Calendar className="h-5 w-5 text-amber-600" />
            Upcoming Yahrzeits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-600 text-center">No upcoming yahrzeits in the next year.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-sky-100 border-sky-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-amber-600 via-blue-600 to-amber-600 bg-clip-text text-transparent">
          <Calendar className="h-5 w-5 text-amber-600" />
          Upcoming Yahrzeits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {yahrzeits.slice(0, 10).map((yahrzeit) => (
          <div
            key={yahrzeit.id}
            className={`p-4 rounded-lg border ${
              yahrzeit.is_soon 
                ? 'border-amber-300 bg-amber-50' 
                : 'border-blue-200 bg-blue-50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent">
                  {yahrzeit.name}
                </h3>
                {yahrzeit.hebrew_name && (
                  <p className="text-sm bg-gradient-to-r from-amber-600 via-blue-600 to-amber-600 bg-clip-text text-transparent font-medium">
                    {yahrzeit.hebrew_name}
                  </p>
                )}
                {yahrzeit.relationship && (
                  <p className="text-xs bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent">
                    {yahrzeit.relationship}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  yahrzeit.is_soon 
                    ? 'bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 bg-clip-text text-transparent' 
                    : 'bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent'
                }`}>
                  <Clock className={`h-4 w-4 ${yahrzeit.is_soon ? 'text-amber-600' : 'text-blue-600'}`} />
                  {getDaysText(yahrzeit.days_until)}
                </div>
              </div>
            </div>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent">
                  Gregorian:
                </span> 
                <span className="ml-1 bg-gradient-to-r from-amber-600 via-blue-600 to-amber-600 bg-clip-text text-transparent">
                  {formatDate(yahrzeit.yahrzeit_date)}
                </span>
              </p>
              <p>
                <span className="font-medium bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent">
                  Hebrew:
                </span> 
                <span className="ml-1 bg-gradient-to-r from-amber-600 via-blue-600 to-amber-600 bg-clip-text text-transparent">
                  {yahrzeit.hebrew_yahrzeit_date}
                </span>
              </p>
            </div>
          </div>
        ))}
        
        {yahrzeits.length > 10 && (
          <p className="text-sm bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent text-center">
            And {yahrzeits.length - 10} more...
          </p>
        )}
      </CardContent>
    </Card>
  );
}
