import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { YahrzeitEntry } from '@/types/yahrzeit';
import { Trash2, Edit } from 'lucide-react';

interface YahrzeitListProps {
  entries: YahrzeitEntry[];
  onEdit: (entry: YahrzeitEntry) => void;
  onDelete: (id: number) => void;
}

export function YahrzeitList({ entries, onEdit, onDelete }: YahrzeitListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (entries.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 via-amber-50 to-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <p className="bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent">
            No yahrzeit entries found. Add your first entry above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry.id} className="bg-gradient-to-r from-blue-50 via-amber-50 to-blue-50 border-blue-200 shadow-md">
          <CardHeader className="pb-3 bg-gradient-to-r from-blue-100 via-amber-100 to-blue-100">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent font-bold">
                  {entry.name}
                </CardTitle>
                {entry.hebrew_name && (
                  <p className="text-sm bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent font-semibold mt-1">
                    {entry.hebrew_name}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(entry)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(entry.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent">Date of Passing</p>
                <p className="bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent">{formatDate(entry.death_date)}</p>
              </div>
              {entry.relationship && (
                <div>
                  <p className="font-medium bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent">Relationship</p>
                  <p className="bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent">{entry.relationship}</p>
                </div>
              )}
              <div>
                <p className="font-medium bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent">Notification</p>
                <p className="bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent">{entry.notify_days_before} days before</p>
              </div>
              {entry.notes && (
                <div className="md:col-span-2">
                  <p className="font-medium bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent">Notes</p>
                  <p className="bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent">{entry.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
