import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { MessageSquare, Check, Star } from 'lucide-react';
import { ShmirasHalashonFormData } from '@/types/shmiras-halashon';

interface ShmirasHalashonFormProps {
  onSubmit: (data: ShmirasHalashonFormData) => Promise<void>;
  initialData?: Partial<ShmirasHalashonFormData>;
  selectedDate: string;
}

export function ShmirasHalashonForm({ onSubmit, initialData, selectedDate }: ShmirasHalashonFormProps) {
  const [formData, setFormData] = React.useState<ShmirasHalashonFormData>({
    date_recorded: selectedDate,
    positive_speech_count: initialData?.positive_speech_count || 0,
    avoided_lashon_hara: initialData?.avoided_lashon_hara || 0,
    gave_compliments: initialData?.gave_compliments || 0,
    spoke_words_of_torah: initialData?.spoke_words_of_torah || 0,
    helped_through_speech: initialData?.helped_through_speech || 0,
    reflection_notes: initialData?.reflection_notes || '',
    daily_goal: initialData?.daily_goal || '',
    challenges_faced: initialData?.challenges_faced || '',
    improvements_noticed: initialData?.improvements_noticed || '',
    overall_rating: initialData?.overall_rating || 3
  });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setFormData(prev => ({ ...prev, date_recorded: selectedDate }));
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ShmirasHalashonFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRatingLabel = (rating: number) => {
    const labels = {
      1: 'Challenging day - many struggles',
      2: 'Difficult - some lapses',
      3: 'Average - room for improvement',
      4: 'Good - mostly positive speech',
      5: 'Excellent - mindful and kind speech'
    };
    return labels[rating] || '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-green-600" />
          Daily Shmiras HaLashon Reflection
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your speech awareness for {new Date(selectedDate).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="positive-speech">Positive Words Spoken</Label>
              <Input
                id="positive-speech"
                type="number"
                min="0"
                value={formData.positive_speech_count}
                onChange={(e) => handleInputChange('positive_speech_count', parseInt(e.target.value) || 0)}
                placeholder="Count"
              />
              <p className="text-xs text-muted-foreground">Encouraging, uplifting words</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avoided-lashon-hara">Times Avoided Lashon Hara</Label>
              <Input
                id="avoided-lashon-hara"
                type="number"
                min="0"
                value={formData.avoided_lashon_hara}
                onChange={(e) => handleInputChange('avoided_lashon_hara', parseInt(e.target.value) || 0)}
                placeholder="Count"
              />
              <p className="text-xs text-muted-foreground">Stopped yourself from speaking negatively</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gave-compliments">Compliments Given</Label>
              <Input
                id="gave-compliments"
                type="number"
                min="0"
                value={formData.gave_compliments}
                onChange={(e) => handleInputChange('gave_compliments', parseInt(e.target.value) || 0)}
                placeholder="Count"
              />
              <p className="text-xs text-muted-foreground">Genuine praise to others</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="torah-words">Times Spoke Words of Torah</Label>
              <Input
                id="torah-words"
                type="number"
                min="0"
                value={formData.spoke_words_of_torah}
                onChange={(e) => handleInputChange('spoke_words_of_torah', parseInt(e.target.value) || 0)}
                placeholder="Count"
              />
              <p className="text-xs text-muted-foreground">Shared Torah insights or lessons</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="helped-speech">Times Helped Through Speech</Label>
              <Input
                id="helped-speech"
                type="number"
                min="0"
                value={formData.helped_through_speech}
                onChange={(e) => handleInputChange('helped_through_speech', parseInt(e.target.value) || 0)}
                placeholder="Count"
              />
              <p className="text-xs text-muted-foreground">Comforted, advised, or assisted someone</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Overall Speech Rating for Today</Label>
              <div className="px-3">
                <Slider
                  value={[formData.overall_rating]}
                  onValueChange={(value) => handleInputChange('overall_rating', value[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{formData.overall_rating}/5</span>
                <span className="text-muted-foreground">- {getRatingLabel(formData.overall_rating)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="daily-goal">Tomorrow's Speech Goal</Label>
              <Input
                id="daily-goal"
                type="text"
                value={formData.daily_goal}
                onChange={(e) => handleInputChange('daily_goal', e.target.value)}
                placeholder="What do you want to focus on improving tomorrow?"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="challenges">Challenges Faced Today</Label>
              <Textarea
                id="challenges"
                value={formData.challenges_faced}
                onChange={(e) => handleInputChange('challenges_faced', e.target.value)}
                placeholder="What situations made it difficult to guard your speech?"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="improvements">Improvements Noticed</Label>
              <Textarea
                id="improvements"
                value={formData.improvements_noticed}
                onChange={(e) => handleInputChange('improvements_noticed', e.target.value)}
                placeholder="What positive changes have you noticed in your speech patterns?"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reflection">Daily Reflection</Label>
              <Textarea
                id="reflection"
                value={formData.reflection_notes}
                onChange={(e) => handleInputChange('reflection_notes', e.target.value)}
                placeholder="Any additional thoughts about your speech today..."
                rows={4}
              />
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            <Check className="h-4 w-4 mr-2" />
            {submitting ? 'Saving...' : initialData ? 'Update Reflection' : 'Save Daily Reflection'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
