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
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No yahrzeit entries found. Add your first entry above.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card key={entry.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{entry.name}</CardTitle>
                {entry.hebrew_name && (
                  <p className="text-sm text-muted-foreground mt-1">{entry.hebrew_name}</p>
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
                <p className="font-medium">Date of Passing</p>
                <p className="text-muted-foreground">{formatDate(entry.death_date)}</p>
              </div>
              {entry.relationship && (
                <div>
                  <p className="font-medium">Relationship</p>
                  <p className="text-muted-foreground">{entry.relationship}</p>
                </div>
              )}
              <div>
                <p className="font-medium">Notification</p>
                <p className="text-muted-foreground">{entry.notify_days_before} days before</p>
              </div>
              {entry.notes && (
                <div className="md:col-span-2">
                  <p className="font-medium">Notes</p>
                  <p className="text-muted-foreground">{entry.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
