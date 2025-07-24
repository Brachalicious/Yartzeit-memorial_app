import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BookOpen, Check } from 'lucide-react';
import { LearningActivityFormData } from '@/types/learning';

interface TorahSectionProps {
  onComplete: (data: LearningActivityFormData) => Promise<void>;
}

const TORAH_OPTIONS = [
  { value: 'weekly-parsha', title: 'Weekly Parsha', description: 'This week\'s Torah portion' },
  { value: 'mishnah-daily', title: 'Daily Mishnah', description: 'A chapter of Mishnah' },
  { value: 'gemara-page', title: 'Daf Yomi', description: 'Daily page of Talmud' },
  { value: 'rambam-daily', title: 'Daily Rambam', description: '3 chapters of Mishneh Torah' },
  { value: 'ein-yaakov', title: 'Ein Yaakov', description: 'Aggadic portions of the Talmud' },
  { value: 'zohar-daily', title: 'Daily Zohar', description: 'A portion of the holy Zohar' },
  { value: 'pirkei-avot', title: 'Pirkei Avot', description: 'Ethics of the Fathers' },
  { value: 'sefer-hachinuch', title: 'Sefer HaChinuch', description: 'The Book of Mitzvot Education' },
  { value: 'custom-study', title: 'Custom Torah Study', description: 'Your own Torah learning' }
];

export function TorahSection({ onComplete }: TorahSectionProps) {
  const [selectedOption, setSelectedOption] = React.useState('');
  const [customTopic, setCustomTopic] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isCompleting, setIsCompleting] = React.useState(false);

  const handleComplete = async () => {
    if (!selectedOption) return;

    setIsCompleting(true);
    
    try {
      const selectedTorah = TORAH_OPTIONS.find(opt => opt.value === selectedOption);
      let title = selectedTorah?.title || 'Custom Torah Study';
      let description = selectedTorah?.description || '';

      if (selectedOption === 'custom-study' && customTopic) {
        title = `Torah Study: ${customTopic}`;
        description = 'Custom Torah learning session';
      }

      await onComplete({
        activity_type: 'torah',
        title,
        description,
        date_completed: new Date().toISOString().split('T')[0],
        notes: notes.trim() || null
      });

      // Reset form
      setSelectedOption('');
      setCustomTopic('');
      setNotes('');
    } catch (error) {
      console.error('Error completing Torah study:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Learn Torah in Memory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="torah-option">Choose what to learn:</Label>
            <Select value={selectedOption} onValueChange={setSelectedOption}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Torah learning option" />
              </SelectTrigger>
              <SelectContent>
                {TORAH_OPTIONS.map((option) => (
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

          {selectedOption === 'custom-study' && (
            <div className="space-y-2">
              <Label htmlFor="custom-topic">Specify your Torah study topic:</Label>
              <input
                id="custom-topic"
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g., Hilchot Shabbat, Masechet Berachot, etc."
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="torah-notes">Learning notes or insights (optional):</Label>
            <Textarea
              id="torah-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Share any insights or reflections from your learning..."
              rows={3}
            />
          </div>

          <Button 
            onClick={handleComplete}
            disabled={!selectedOption || isCompleting || (selectedOption === 'custom-study' && !customTopic.trim())}
            className="w-full flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {isCompleting ? 'Recording...' : 'I Have Completed This Learning'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">The Merit of Torah Learning</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Torah learning dedicated to the memory of a departed soul creates tremendous merit that 
            elevates their neshomah in the heavenly realms. Each word of Torah studied with pure 
            intention becomes a source of eternal light for the soul. The Talmud teaches us that 
            when we learn Torah and dedicate it to someone's memory, it's as if they are learning 
            Torah themselves in the World to Come.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
