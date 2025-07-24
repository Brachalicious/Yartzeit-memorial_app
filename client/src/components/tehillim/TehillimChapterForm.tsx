import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, Heart } from 'lucide-react';
import { TehillimChapterFormData } from '@/types/tehillim';

interface TehillimChapterFormProps {
  onComplete: (data: TehillimChapterFormData) => Promise<void>;
  remainingChapters?: number[];
}

export function TehillimChapterForm({ onComplete, remainingChapters = [] }: TehillimChapterFormProps) {
  const [chapterNumber, setChapterNumber] = React.useState('');
  const [chapterName, setChapterName] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isCompleting, setIsCompleting] = React.useState(false);

  const handleComplete = async () => {
    const number = parseInt(chapterNumber);
    if (!number || number < 1 || number > 150) return;

    setIsCompleting(true);
    
    try {
      await onComplete({
        chapter_number: number,
        chapter_name: chapterName.trim() || undefined,
        date_completed: new Date().toISOString().split('T')[0],
        notes: notes.trim() || undefined
      });

      // Reset form
      setChapterNumber('');
      setChapterName('');
      setNotes('');
    } catch (error) {
      console.error('Error completing Tehillim chapter:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSelectChapter = (number: number) => {
    setChapterNumber(number.toString());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Record Individual Tehillim Chapter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="chapter-number">Chapter Number (1-150) *</Label>
          <Input
            id="chapter-number"
            type="number"
            min="1"
            max="150"
            value={chapterNumber}
            onChange={(e) => setChapterNumber(e.target.value)}
            placeholder="Enter chapter number"
          />
        </div>

        {remainingChapters.length > 0 && (
          <div className="space-y-2">
            <Label>Quick Select from Remaining Chapters:</Label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {remainingChapters.slice(0, 20).map((number) => (
                <Button
                  key={number}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectChapter(number)}
                  className="text-xs"
                >
                  {number}
                </Button>
              ))}
              {remainingChapters.length > 20 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{remainingChapters.length - 20} more...
                </span>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="chapter-name">Chapter Name (optional)</Label>
          <Input
            id="chapter-name"
            type="text"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            placeholder="e.g., Mizmor L'David, Shir HaMaalot"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chapter-notes">Personal notes or intentions (optional)</Label>
          <Textarea
            id="chapter-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share any special intentions or thoughts..."
            rows={3}
          />
        </div>

        <Button 
          onClick={handleComplete}
          disabled={!chapterNumber || parseInt(chapterNumber) < 1 || parseInt(chapterNumber) > 150 || isCompleting}
          className="w-full flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          {isCompleting ? 'Recording...' : 'I Have Completed This Chapter'}
        </Button>
      </CardContent>
    </Card>
  );
}
