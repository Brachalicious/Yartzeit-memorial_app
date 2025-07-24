import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Heart, Check } from 'lucide-react';
import { LearningActivityFormData } from '@/types/learning';

interface TehillimSectionProps {
  onComplete: (data: LearningActivityFormData) => Promise<void>;
}

const TEHILLIM_OPTIONS = [
  { value: 'chapter-23', title: 'Chapter 23 - Mizmor L\'David', description: 'The Lord is my shepherd' },
  { value: 'chapter-121', title: 'Chapter 121 - Shir LaMaalot', description: 'I lift my eyes to the mountains' },
  { value: 'chapter-130', title: 'Chapter 130 - Shir HaMaalot', description: 'From the depths I call to You' },
  { value: 'chapter-142', title: 'Chapter 142 - Maskil L\'David', description: 'I cry out to the Lord' },
  { value: 'chapter-20', title: 'Chapter 20 - LaMenatzeiach', description: 'May the Lord answer you in distress' },
  { value: 'chapter-91', title: 'Chapter 91 - Yoshev B\'Seter', description: 'He who dwells in shelter' },
  { value: 'daily-portion', title: 'Daily Tehillim Portion', description: 'Monthly cycle based on today\'s date' },
  { value: 'custom', title: 'Custom Chapters', description: 'Choose specific chapters' }
];

export function TehillimSection({ onComplete }: TehillimSectionProps) {
  const [selectedOption, setSelectedOption] = React.useState('');
  const [customChapters, setCustomChapters] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isCompleting, setIsCompleting] = React.useState(false);

  const handleComplete = async () => {
    if (!selectedOption) return;

    setIsCompleting(true);
    
    try {
      const selectedTehillim = TEHILLIM_OPTIONS.find(opt => opt.value === selectedOption);
      let title = selectedTehillim?.title || 'Custom Tehillim';
      let description = selectedTehillim?.description || '';

      if (selectedOption === 'custom' && customChapters) {
        title = `Tehillim Chapters: ${customChapters}`;
        description = 'Custom selection of Tehillim chapters';
      }

      await onComplete({
        activity_type: 'tehillim',
        title,
        description,
        date_completed: new Date().toISOString().split('T')[0],
        notes: notes.trim() || null
      });

      // Reset form
      setSelectedOption('');
      setCustomChapters('');
      setNotes('');
    } catch (error) {
      console.error('Error completing Tehillim:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Say Tehillim in Memory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tehillim-option">Choose Tehillim to recite:</Label>
            <Select value={selectedOption} onValueChange={setSelectedOption}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Tehillim option" />
              </SelectTrigger>
              <SelectContent>
                {TEHILLIM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.title}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedOption === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="custom-chapters">Specify chapters (e.g., "1, 3, 23, 121"):</Label>
              <input
                id="custom-chapters"
                type="text"
                value={customChapters}
                onChange={(e) => setCustomChapters(e.target.value)}
                placeholder="Enter chapter numbers separated by commas"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tehillim-notes">Personal notes or intentions (optional):</Label>
            <Textarea
              id="tehillim-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Share any special intentions or thoughts..."
              rows={3}
            />
          </div>

          <Button 
            onClick={handleComplete}
            disabled={!selectedOption || isCompleting || (selectedOption === 'custom' && !customChapters.trim())}
            className="w-full flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {isCompleting ? 'Recording...' : 'I Have Completed This Tehillim'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">The Power of Tehillim</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Reciting Tehillim (Psalms) creates a spiritual connection that transcends this world. 
            Each word carries the power to elevate the soul of our departed loved ones. When we say 
            Tehillim with intention and love, we are sending our prayers directly to the throne of 
            the Almighty, asking for the soul's elevation and peace in the World to Come.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
