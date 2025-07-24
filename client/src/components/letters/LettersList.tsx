import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Letter } from '@/types/letters';
import { Trash2, Calendar } from 'lucide-react';

interface LettersListProps {
  letters: Letter[];
  onDelete: (id: number) => void;
}

export function LettersList({ letters, onDelete }: LettersListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this letter?')) {
      onDelete(id);
    }
  };

  if (letters.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No letters have been sent yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Previously Sent Letters</h3>
      {letters.map((letter) => (
        <Card key={letter.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(letter.created_at)}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(letter.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
              {letter.content}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
