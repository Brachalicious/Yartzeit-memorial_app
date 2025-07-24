import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TehillimProgress as TehillimProgressType } from '@/types/tehillim';
import { BookOpen, CheckCircle, Circle } from 'lucide-react';

interface TehillimProgressProps {
  progress: TehillimProgressType;
}

export function TehillimProgress({ progress }: TehillimProgressProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Tehillim Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {progress.completed_count} / {progress.total_chapters}
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              Chapters Completed
            </div>
            <Progress value={progress.progress_percentage} className="w-full" />
            <div className="text-sm text-muted-foreground mt-2">
              {progress.progress_percentage}% Complete
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium">{progress.completed_count}</span>
              <span className="text-sm text-muted-foreground">Done</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Circle className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{progress.remaining_count}</span>
              <span className="text-sm text-muted-foreground">Remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {progress.remaining_count > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Next Chapters to Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {progress.remaining_chapters.slice(0, 15).map((chapter) => (
                <span
                  key={chapter}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                >
                  {chapter}
                </span>
              ))}
              {progress.remaining_count > 15 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  +{progress.remaining_count - 15} more
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
