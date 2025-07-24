import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TehillimChapterInfo } from '@/types/sefaria';
import { BookOpen, Star } from 'lucide-react';

interface TehillimDetailsProps {
  chapterInfo: TehillimChapterInfo;
}

export function TehillimDetails({ chapterInfo }: TehillimDetailsProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Chapter {chapterInfo.chapterNumber} Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">English Title</h4>
            <p className="font-medium">{chapterInfo.englishTitle}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Hebrew Title</h4>
            <p className="font-medium text-right" dir="rtl">{chapterInfo.hebrewTitle}</p>
          </div>
        </div>

        {chapterInfo.commonName && (
          <div className="flex items-center gap-2 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <Star className="h-4 w-4 text-yellow-600" />
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Common Name</h4>
              <p className="font-medium">{chapterInfo.commonName}</p>
            </div>
          </div>
        )}

        {chapterInfo.firstVerse && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground">Opening Verse</h4>
            
            {chapterInfo.hebrewFirstVerse && (
              <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                <p className="text-lg leading-relaxed text-right" dir="rtl">
                  {chapterInfo.hebrewFirstVerse}
                </p>
              </div>
            )}
            
            <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <p className="text-sm italic leading-relaxed">
                {chapterInfo.firstVerse}
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p>Chapter information provided by Sefaria.org</p>
        </div>
      </CardContent>
    </Card>
  );
}
