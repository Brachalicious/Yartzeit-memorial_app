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
  const [activeTab, setActiveTab] = React.useState<'record'>('record');

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
      <Card className="bg-gradient-to-r from-blue-50 via-amber-50 to-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent">
            📜 Torah Study Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent">
            Access Torah texts directly for study and learning in her memory.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-white border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-700">📚 Torah (Five Books)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => window.open('https://www.sefaria.org/Genesis.1', '_blank')}
                  className="w-full bg-amber-500 hover:bg-amber-600"
                >
                  🌟 Genesis (Bereishit)
                </Button>
                <Button 
                  onClick={() => window.open('https://www.sefaria.org/Exodus.1', '_blank')}
                  className="w-full bg-amber-500 hover:bg-amber-600"
                >
                  🔥 Exodus (Shemot)
                </Button>
                <Button 
                  onClick={() => window.open('https://www.sefaria.org/Leviticus.1', '_blank')}
                  className="w-full bg-amber-500 hover:bg-amber-600"
                >
                  🕊️ Leviticus (Vayikra)
                </Button>
                <Button 
                  onClick={() => window.open('https://www.sefaria.org/Numbers.1', '_blank')}
                  className="w-full bg-amber-500 hover:bg-amber-600"
                >
                  🏜️ Numbers (Bamidbar)
                </Button>
                <Button 
                  onClick={() => window.open('https://www.sefaria.org/Deuteronomy.1', '_blank')}
                  className="w-full bg-amber-500 hover:bg-amber-600"
                >
                  📖 Deuteronomy (Devarim)
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">📚 Other Sacred Texts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => window.open('https://www.sefaria.org/Ecclesiastes', '_blank')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  ⏰ Ecclesiastes (Kohelet)
                </Button>
                <Button 
                  onClick={() => window.open('https://www.sefaria.org/Proverbs', '_blank')}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  💎 Proverbs (Mishlei)
                </Button>
                <Button 
                  onClick={() => window.open('https://www.sefaria.org/Job', '_blank')}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  💪 Job (Iyov)
                </Button>
                <Button 
                  onClick={() => window.open('https://www.sefaria.org/Song_of_Songs', '_blank')}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  🌹 Song of Songs (Shir HaShirim)
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700">📖 Talmud & Mishnah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => window.open('https://www.sefaria.org/texts/Talmud', '_blank')}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                📜 Browse Talmud
              </Button>
              <Button 
                onClick={() => window.open('https://www.sefaria.org/texts/Mishnah', '_blank')}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                📋 Browse Mishnah
              </Button>
              <Button 
                onClick={() => window.open('https://www.sefaria.org/Pirkei_Avot', '_blank')}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                🧘 Pirkei Avot (Ethics)
              </Button>
            </CardContent>
          </Card>
          
          <div className="text-center mt-4">
            <Button 
              onClick={() => window.open('https://www.sefaria.org/texts', '_blank')}
              className="bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-700 hover:to-purple-700 text-white"
            >
              📖 See All Torah Texts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Torah Study Completion Form */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Record Your Torah Study
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="torah-option">What did you study?</Label>
            <Select value={selectedOption} onValueChange={setSelectedOption}>
              <SelectTrigger>
                <SelectValue placeholder="Select Torah study type" />
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
              <Label htmlFor="custom-topic">Specify what you studied:</Label>
              <input
                id="custom-topic"
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g., Rashi on Genesis 1:1, Maimonides Guide 1:1"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="torah-notes">Study notes or insights (optional):</Label>
            <Textarea
              id="torah-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Share any insights, questions, or reflections from your study..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleComplete}
              disabled={!selectedOption || isCompleting || (selectedOption === 'custom-study' && !customTopic.trim())}
              className="flex-1 flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              {isCompleting ? 'Recording...' : 'I Have Completed This Study'}
            </Button>

            {/* Share Torah Study Button */}
            <Button
              onClick={() => {
                const selectedTorah = TORAH_OPTIONS.find(opt => opt.value === selectedOption);
                const studyText = `🕯️ I just studied Torah in memory of Chaya Sara Leah Bas Uri zt"l

📜 Study: ${selectedTorah?.title || 'Custom Torah Study'}
${selectedOption === 'custom-study' && customTopic ? `📖 Topic: ${customTopic}` : ''}
${notes ? `💭 My insights: ${notes}` : ''}

Join me in Torah learning to elevate her holy neshomah: ${window.location.href}

לעילוי נשמת חיה שרה לאה בת אורי ז״ל`;

                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(studyText)}`;
                const emailUrl = `mailto:?subject=${encodeURIComponent('Torah Study for Chaya Sara Leah')}&body=${encodeURIComponent(studyText)}`;
                
                // Create share menu
                const shareMenu = document.createElement('div');
                shareMenu.style.cssText = `
                  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                  background: white; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                  padding: 20px; z-index: 1000; min-width: 300px;
                `;
                
                shareMenu.innerHTML = `
                  <h3 style="margin: 0 0 15px 0; font-weight: bold; color: #1e40af;">Share Torah Study</h3>
                  <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button onclick="window.open('${whatsappUrl}', '_blank'); document.body.removeChild(document.querySelector('[data-torah-menu]'))" 
                            style="background: #25d366; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                      📱 Share via WhatsApp
                    </button>
                    <button onclick="window.open('${emailUrl}', '_blank'); document.body.removeChild(document.querySelector('[data-torah-menu]'))" 
                            style="background: #ea4335; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                      📧 Share via Email
                    </button>
                    <button onclick="navigator.clipboard.writeText('${studyText.replace(/'/g, "\\'")}'); alert('📋 Torah study shared!'); document.body.removeChild(document.querySelector('[data-torah-menu]'))" 
                            style="background: #6366f1; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                      📋 Copy to Clipboard
                    </button>
                    <button onclick="document.body.removeChild(document.querySelector('[data-torah-menu]'))" 
                            style="background: #6b7280; color: white; border: none; padding: 8px; border-radius: 8px; cursor: pointer;">
                      Cancel
                    </button>
                  </div>
                `;
                
                shareMenu.setAttribute('data-torah-menu', 'true');
                document.body.appendChild(shareMenu);
              }}
              variant="outline"
              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              disabled={!selectedOption}
            >
              📤 Share Study
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
