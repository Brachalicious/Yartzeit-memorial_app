import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TehillimChapter } from '@/types/tehillim';
import { Trash2, Calendar, Heart } from 'lucide-react';

interface TehillimHistoryProps {
  chapters: TehillimChapter[];
  onDelete: (id: number) => void;
}

export function TehillimHistory({ chapters, onDelete }: TehillimHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this Tehillim chapter record?')) {
      onDelete(id);
    }
  };

  const groupedChapters = React.useMemo(() => {
    const groups: { [key: string]: TehillimChapter[] } = {};
    
    chapters.forEach(chapter => {
      const date = chapter.date_completed;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(chapter);
    });
    
    // Sort chapters within each day by chapter number
    Object.keys(groups).forEach(date => {
      groups[date].sort((a, b) => a.chapter_number - b.chapter_number);
    });
    
    return Object.entries(groups).sort(([dateA], [dateB]) => 
      new Date(dateB).getTime() - new Date(dateA).getTime()
    );
  }, [chapters]);

  if (chapters.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No Tehillim chapters recorded yet. Start by completing individual chapters!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Tehillim Chapter History</h2>
        <p className="text-muted-foreground mt-2">
          {chapters.length} chapters completed in memory of Chaya Sara Leah
        </p>
      </div>

      <div className="grid gap-4">
        {groupedChapters.map(([date, dayChapters]) => (
          <Card key={date}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                {formatDate(date)}
                <span className="text-sm text-muted-foreground font-normal">
                  ({dayChapters.length} {dayChapters.length === 1 ? 'chapter' : 'chapters'})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-3">
                {dayChapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="p-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <h3 className="font-semibold">
                            Chapter {chapter.chapter_number}
                            {chapter.chapter_name && ` - ${chapter.chapter_name}`}
                          </h3>
                        </div>
                        
                        {chapter.notes && (
                          <div className="mt-3 p-3 bg-white/50 dark:bg-black/20 rounded text-sm">
                            <strong>Notes:</strong> {chapter.notes}
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(chapter.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
