import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Heart, Users, Clock, BookOpen, MessageSquare, Share2, Calendar } from 'lucide-react';

interface SharedLearningEntry {
  id: string;
  learner_name: string;
  torah_studied: string;
  time_spent: number; // in minutes
  date_completed: string;
  notes?: string;
  encouragement_reactions: { emoji: string; count: number }[];
  responses: { 
    id: string; 
    responder_name: string; 
    message: string; 
    date: string; 
    emoji_reaction?: string;
  }[];
}

interface SharedLearningSectionProps {
  onComplete?: () => void;
}

export function SharedLearningSection({ onComplete }: SharedLearningSectionProps) {
  const [entries, setEntries] = React.useState<SharedLearningEntry[]>([]);
  const [newEntry, setNewEntry] = React.useState({
    learner_name: '',
    torah_studied: '',
    time_spent: '',
    notes: ''
  });
  const [showForm, setShowForm] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState<string | null>(null);
  const [responseText, setResponseText] = React.useState('');
  const [responderName, setResponderName] = React.useState('');

  // Load entries from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('sharedLearningEntries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }

    // Load responder name
    const savedName = localStorage.getItem('sharedLearningResponderName');
    if (savedName) {
      setResponderName(savedName);
    }
  }, []);

  // Save entries to localStorage
  const saveEntries = (newEntries: SharedLearningEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('sharedLearningEntries', JSON.stringify(newEntries));
  };

  const handleSubmitEntry = () => {
    if (!newEntry.learner_name.trim() || !newEntry.torah_studied.trim() || !newEntry.time_spent) {
      alert('Please fill in all required fields');
      return;
    }

    const entry: SharedLearningEntry = {
      id: Date.now().toString(),
      learner_name: newEntry.learner_name.trim(),
      torah_studied: newEntry.torah_studied.trim(),
      time_spent: parseInt(newEntry.time_spent),
      date_completed: new Date().toISOString(),
      notes: newEntry.notes.trim() || undefined,
      encouragement_reactions: [],
      responses: []
    };

    const newEntries = [entry, ...entries];
    saveEntries(newEntries);

    // Reset form
    setNewEntry({
      learner_name: '',
      torah_studied: '',
      time_spent: '',
      notes: ''
    });
    setShowForm(false);

    if (onComplete) {
      onComplete();
    }
  };

  const handleEmojiReaction = (entryId: string, emoji: string) => {
    const newEntries = entries.map(entry => {
      if (entry.id === entryId) {
        const existingReaction = entry.encouragement_reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...entry,
            encouragement_reactions: entry.encouragement_reactions.map(r =>
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...entry,
            encouragement_reactions: [...entry.encouragement_reactions, { emoji, count: 1 }]
          };
        }
      }
      return entry;
    });
    saveEntries(newEntries);
  };

  const handleAddResponse = (entryId: string) => {
    if (!responseText.trim() || !responderName.trim()) {
      alert('Please enter your name and a response');
      return;
    }

    // Save responder name
    localStorage.setItem('sharedLearningResponderName', responderName);

    const response = {
      id: Date.now().toString(),
      responder_name: responderName.trim(),
      message: responseText.trim(),
      date: new Date().toISOString()
    };

    const newEntries = entries.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          responses: [...entry.responses, response]
        };
      }
      return entry;
    });
    saveEntries(newEntries);

    setResponseText('');
    setSelectedEntry(null);
  };

  const shareEntry = (entry: SharedLearningEntry) => {
    const shareText = `🕯️ ${entry.learner_name} studied Torah in memory of Chaya Sara Leah Bas Uri zt"l

📖 Study: ${entry.torah_studied}
⏰ Time: ${entry.time_spent} minutes
📅 Date: ${new Date(entry.date_completed).toLocaleDateString()}

${entry.notes ? `💭 Notes: ${entry.notes}` : ''}

Join our shared learning to elevate her holy neshomah: ${window.location.href}

לעילוי נשמת חיה שרה לאה בת אורי ז״ל`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent('Shared Torah Learning for Chaya Sara Leah')}&body=${encodeURIComponent(shareText)}`;
    
    // Create share menu
    const shareMenu = document.createElement('div');
    shareMenu.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: white; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      padding: 20px; z-index: 1000; min-width: 300px;
    `;
    
    shareMenu.innerHTML = `
      <h3 style="margin: 0 0 15px 0; font-weight: bold; color: #1e40af;">Share Learning</h3>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button onclick="window.open('${whatsappUrl}', '_blank'); document.body.removeChild(document.querySelector('[data-share-learning-menu]'))" 
                style="background: #25d366; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">
          📱 Share via WhatsApp
        </button>
        <button onclick="window.open('${emailUrl}', '_blank'); document.body.removeChild(document.querySelector('[data-share-learning-menu]'))" 
                style="background: #ea4335; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">
          📧 Share via Email
        </button>
        <button onclick="navigator.clipboard.writeText('${shareText.replace(/'/g, "\\'")}'); alert('📋 Learning shared!'); document.body.removeChild(document.querySelector('[data-share-learning-menu]'))" 
                style="background: #6366f1; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">
          📋 Copy to Clipboard
        </button>
        <button onclick="document.body.removeChild(document.querySelector('[data-share-learning-menu]'))" 
                style="background: #6b7280; color: white; border: none; padding: 8px; border-radius: 8px; cursor: pointer;">
          Cancel
        </button>
      </div>
    `;
    
    shareMenu.setAttribute('data-share-learning-menu', 'true');
    document.body.appendChild(shareMenu);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-8 w-8 text-purple-600" />
            <Heart className="h-6 w-6 text-red-500" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Shared Learning Community
          </h2>
          <p className="text-purple-600 mb-4">
            Join together in Torah study to elevate the neshomah of Chaya Sara Leah Bas Uri זצ״ל
          </p>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            {showForm ? 'Hide Form' : 'Share Your Learning'}
          </Button>
        </CardContent>
      </Card>

      {/* Learning Entry Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Share Your Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="learner-name">Your Name *</Label>
                <Input
                  id="learner-name"
                  value={newEntry.learner_name}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, learner_name: e.target.value }))}
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-spent">Time Spent (minutes) *</Label>
                <Input
                  id="time-spent"
                  type="number"
                  min="1"
                  value={newEntry.time_spent}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, time_spent: e.target.value }))}
                  placeholder="e.g., 30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="torah-studied">What Torah did you study? *</Label>
              <Input
                id="torah-studied"
                value={newEntry.torah_studied}
                onChange={(e) => setNewEntry(prev => ({ ...prev, torah_studied: e.target.value }))}
                placeholder="e.g., Tehillim Chapter 23, Gemara Berachot 5a, Parashat Bereishit"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes or reflections (optional)</Label>
              <Textarea
                id="notes"
                value={newEntry.notes}
                onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Share any insights, intentions, or reflections..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitEntry} className="flex-1">
                📖 Share My Learning
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Entries */}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No shared learning yet</h3>
              <p className="text-gray-500">Be the first to share your Torah study in memory of Chaya Sara Leah!</p>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-purple-700">{entry.learner_name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {entry.time_spent} minutes
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(entry.date_completed)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareEntry(entry)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mb-4">
                  <p className="font-semibold text-blue-600 mb-2">📖 {entry.torah_studied}</p>
                  {entry.notes && (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg italic">
                      "{entry.notes}"
                    </p>
                  )}
                </div>

                {/* Emoji Reactions */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {['💪', '👏', '🙏', '❤️', '🌟', '📚'].map((emoji) => {
                    const reaction = entry.encouragement_reactions.find(r => r.emoji === emoji);
                    return (
                      <Button
                        key={emoji}
                        variant="outline"
                        size="sm"
                        onClick={() => handleEmojiReaction(entry.id, emoji)}
                        className="text-xs hover:bg-gray-100"
                      >
                        {emoji} {reaction?.count || 0}
                      </Button>
                    );
                  })}
                </div>

                {/* Responses */}
                {entry.responses.length > 0 && (
                  <div className="border-t pt-4 space-y-3">
                    <h4 className="font-semibold text-sm text-gray-600">Encouragement:</h4>
                    {entry.responses.map((response) => (
                      <div key={response.id} className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-blue-700">{response.responder_name}</span>
                          <span className="text-xs text-gray-500">{formatDate(response.date)}</span>
                        </div>
                        <p className="text-gray-700">{response.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Response Form */}
                {selectedEntry === entry.id ? (
                  <div className="border-t pt-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Your name"
                        value={responderName}
                        onChange={(e) => setResponderName(e.target.value)}
                      />
                      <div></div>
                    </div>
                    <Textarea
                      placeholder="Write an encouraging message..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddResponse(entry.id)}
                        disabled={!responseText.trim() || !responderName.trim()}
                      >
                        Send Encouragement
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEntry(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedEntry(entry.id)}
                      className="w-full"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Encouragement
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
