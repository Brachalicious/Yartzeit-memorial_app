import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Heart, Check, BookOpen } from 'lucide-react';
import { LearningActivityFormData } from '@/types/learning';
import { useTehillim } from '@/hooks/useTehillim';

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

// Simple Tehillim Chapter Form Component
function SimpleTehillimChapterForm({ onComplete, remainingChapters = [] }: {
  onComplete: (data: any) => Promise<void>;
  remainingChapters?: number[];
}) {
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

// Simple Progress Component
function SimpleTehillimProgress({ progress }: { progress: any }) {
  if (!progress) return null;

  return (
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
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress.progress_percentage}%` }}
            ></div>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {progress.progress_percentage}% Complete
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Simple History Component
function SimpleTehillimHistory({ chapters, onDelete }: { chapters: any[]; onDelete: (id: number) => void }) {
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
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Tehillim Chapter History</h2>
        <p className="text-muted-foreground mt-2">
          {chapters.length} chapters completed in memory of Chaya Sara Leah
        </p>
      </div>

      <div className="grid gap-4">
        {chapters.slice(0, 10).map((chapter) => (
          <Card key={chapter.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">
                    Chapter {chapter.chapter_number}
                    {chapter.chapter_name && ` - ${chapter.chapter_name}`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(chapter.date_completed)}
                  </p>
                  {chapter.notes && (
                    <p className="text-sm mt-2 text-muted-foreground">
                      {chapter.notes}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(chapter.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function TehillimSection({ onComplete }: TehillimSectionProps) {
  const [selectedOption, setSelectedOption] = React.useState('');
  const [customChapters, setCustomChapters] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isCompleting, setIsCompleting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'quick' | 'individual' | 'progress' | 'history'>('quick');

  const { chapters, progress, loading, error, createChapter, deleteChapter } = useTehillim();

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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          Loading Tehillim data...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-600">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={activeTab === 'quick' ? 'default' : 'outline'}
          onClick={() => setActiveTab('quick')}
          size="sm"
        >
          Quick Selections
        </Button>
        <Button
          variant={activeTab === 'individual' ? 'default' : 'outline'}
          onClick={() => setActiveTab('individual')}
          size="sm"
        >
          Individual Chapters
        </Button>
        <Button
          variant={activeTab === 'progress' ? 'default' : 'outline'}
          onClick={() => setActiveTab('progress')}
          size="sm"
        >
          Progress Tracker
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'outline'}
          onClick={() => setActiveTab('history')}
          size="sm"
        >
          Chapter History
        </Button>
      </div>

      {activeTab === 'quick' && (
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
                  <Input
                    id="custom-chapters"
                    type="text"
                    value={customChapters}
                    onChange={(e) => setCustomChapters(e.target.value)}
                    placeholder="Enter chapter numbers separated by commas"
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
      )}

      {activeTab === 'individual' && (
        <SimpleTehillimChapterForm 
          onComplete={createChapter}
          remainingChapters={progress?.remaining_chapters}
        />
      )}

      {activeTab === 'progress' && progress && (
        <SimpleTehillimProgress progress={progress} />
      )}

      {activeTab === 'history' && (
        <SimpleTehillimHistory chapters={chapters} onDelete={deleteChapter} />
      )}
    </div>
  );
}
