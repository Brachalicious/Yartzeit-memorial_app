import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TehillimSuggestions as TehillimSuggestionsType } from '@/types/sefaria';
import { Calendar, Star, CheckCircle } from 'lucide-react';

interface TehillimSuggestionsProps {
  suggestions: TehillimSuggestionsType;
  onSelectChapter: (chapterNumber: number) => void;
}

export function TehillimSuggestions({ suggestions, onSelectChapter }: TehillimSuggestionsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Today's Tehillim Portion (Day {suggestions.day_of_month})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {suggestions.daily_portion.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Traditional daily Tehillim for day {suggestions.day_of_month} of the month:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.daily_portion.map((chapter) => (
                  <Button
                    key={chapter}
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectChapter(chapter)}
                    className="text-sm"
                  >
                    Chapter {chapter}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              All of today's suggested chapters have been completed! 🎉
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            Popular Chapters
          </CardTitle>
        </CardHeader>
        <CardContent>
          {suggestions.popular_chapters.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Commonly recited chapters for comfort and blessing:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.popular_chapters.map((chapter) => (
                  <Button
                    key={chapter}
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectChapter(chapter)}
                    className="text-sm"
                  >
                    Chapter {chapter}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              All popular chapters completed today!
            </p>
          )}
        </CardContent>
      </Card>

      {suggestions.completed_today.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Completed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {suggestions.completed_today.map((chapter) => (
                <span
                  key={chapter}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Chapter {chapter} ✓
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
