import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageSquare, Calendar as CalendarIcon, Edit, Plus, Send, X, BookOpen } from 'lucide-react';
import { ShmirasHalashonForm } from './ShmirasHalashonForm';
import { ShmirasHalashonProgress } from './ShmirasHalashonProgress';
import { ShmirasHalashonHistory } from './ShmirasHalashonHistory';
import { useShmirasHalashon } from '@/hooks/useShmirasHalashon';
import { useChofetzChaim } from '@/hooks/useChofetzChaim';
import { cn } from '@/lib/utils';

interface ShmirasHalashonSectionProps {
  onComplete?: () => void;
}

export function ShmirasHalashonSection({ onComplete }: ShmirasHalashonSectionProps) {
  const { entries, stats, loading, error, createEntry, updateEntry, deleteEntry, getEntryByDate } = useShmirasHalashon();
  const { messages, isLoading: chatLoading, error: chatError, sendMessage, addInitialGreeting, clearMessages } = useChofetzChaim();
  const [activeTab, setActiveTab] = React.useState<'today' | 'progress' | 'history'>('today');
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedEntry, setSelectedEntry] = React.useState(null);
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [showChatbot, setShowChatbot] = React.useState(false);
  const [userMessage, setUserMessage] = React.useState('');

  const handleChofetzChaimClick = () => {
    setShowChatbot(true);
    if (messages.length === 0) {
      addInitialGreeting();
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || chatLoading) return;
    await sendMessage(userMessage);
    setUserMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  React.useEffect(() => {
    const loadEntryForDate = async () => {
      const dateString = selectedDate.toISOString().split('T')[0];
      const entry = await getEntryByDate(dateString);
      setSelectedEntry(entry);
    };
    
    loadEntryForDate();
  }, [selectedDate, getEntryByDate]);

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedEntry) {
        await updateEntry(selectedEntry.id, formData);
      } else {
        await createEntry(formData);
      }
      
      // Refresh the entry for the current date
      const dateString = selectedDate.toISOString().split('T')[0];
      const entry = await getEntryByDate(dateString);
      setSelectedEntry(entry);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          Loading Shmiras HaLashon data...
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

  const selectedDateString = selectedDate.toISOString().split('T')[0];
  const isToday = selectedDateString === new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Chofetz Chaim Image Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div 
                className="relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-lg p-2"
                onClick={handleChofetzChaimClick}
                title="Click to ask the Chofetz Chaim about Shmiras HaLashon!"
              >
                <img 
                  src="/chofetz_chaim.png" 
                  alt="The Chofetz Chaim - Click to ask questions!" 
                  className="w-24 h-32 md:w-32 md:h-40 object-contain rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                    background: 'transparent'
                  }}
                />
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                {/* Click instruction - moved much further down */}
                <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center">
                  <p className="text-xs text-purple-600 font-medium bg-white/80 px-2 py-1 rounded-full shadow-sm">
                    Click me for guidance! 💬
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Shmiras HaLashon
              </h2>
              <h3 className="text-lg font-semibold text-purple-700 mb-3">
                In the Merit of the Chofetz Chaim zt"l
              </h3>
              <p className="text-sm text-purple-600 leading-relaxed">
                Guard your speech in memory of Chaya Sara Leah Bas Uri זצ״ל. The Chofetz Chaim taught us that proper speech 
                can elevate souls and bring healing to the world. Each day we guard our tongue is a merit for her neshomah.
              </p>
              <p className="text-xs text-purple-500 mt-2 italic">
                💡 Click on the Chofetz Chaim's image to ask questions about Shmiras HaLashon!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={activeTab === 'today' ? 'default' : 'outline'}
          onClick={() => setActiveTab('today')}
          size="sm"
        >
          Daily Tracking
        </Button>
        <Button
          variant={activeTab === 'progress' ? 'default' : 'outline'}
          onClick={() => setActiveTab('progress')}
          size="sm"
        >
          Progress Overview
        </Button>
        <Button
          variant={activeTab === 'history' ? 'default' : 'outline'}
          onClick={() => setActiveTab('history')}
          size="sm"
        >
          History
        </Button>
      </div>

      {/* Learning Resources Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <MessageSquare className="h-5 w-5" />
            Shmiras HaLashon Learning Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <Button
              onClick={() => window.open('https://cchf.global/daily-companion/#', '_blank')}
              className="bg-purple-600 hover:bg-purple-700 text-white justify-start h-auto p-4"
            >
              <div className="text-left">
                <div className="font-semibold">📚 Daily Companion - CCHF Global</div>
                <div className="text-sm text-purple-100">Complete guide to guarding your speech daily</div>
              </div>
            </Button>
            <div className="text-xs text-purple-600 text-center">
              🛡️ Learn the laws and wisdom of proper speech to elevate your soul
            </div>
          </div>
        </CardContent>
      </Card>

      {activeTab === 'today' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  Shmiras HaLashon Tracker
                </div>
                <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {isToday ? 'Today' : formatSelectedDate(selectedDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          setShowCalendar(false);
                        }
                      }}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedEntry && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Entry exists for {formatFullDate(selectedDate)}
                      </h3>
                      <span className="text-sm text-green-600 font-medium">
                        Rating: {selectedEntry.overall_rating}/5
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can edit this entry to update your reflection.
                    </p>
                  </div>
                )}
                
                {!selectedEntry && !isToday && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Plus className="h-4 w-4" />
                      <h3 className="font-semibold">
                        Add entry for {formatFullDate(selectedDate)}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reflect on your speech awareness for this past day.
                    </p>
                  </div>
                )}
                
                <ShmirasHalashonForm
                  onSubmit={handleFormSubmit}
                  initialData={selectedEntry}
                  selectedDate={selectedDateString}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">The Power of Shmiras HaLashon</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Guarding our speech is one of the most powerful ways to honor the memory of our loved ones. 
                Every moment we choose kind words over harsh ones, encouragement over criticism, or silence 
                over gossip, we elevate not only ourselves but also the souls of those who have passed on.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Chofetz Chaim taught that proper speech brings healing to the world. By tracking your 
                speech awareness daily, you create a living memorial that brings light and blessing to 
                Chaya Sara Leah's neshomah.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'progress' && stats && (
        <ShmirasHalashonProgress stats={stats} />
      )}

      {activeTab === 'history' && (
        <ShmirasHalashonHistory entries={entries} onDelete={deleteEntry} />
      )}

      {/* Chofetz Chaim Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] bg-white shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img 
                    src="/chofetz_chaim.png" 
                    alt="Chofetz Chaim" 
                    className="w-12 h-16 object-contain rounded-lg bg-white/10 p-1"
                    style={{ background: 'transparent' }}
                  />
                  <div>
                    <CardTitle className="text-xl">Ask the Chofetz Chaim</CardTitle>
                    <p className="text-purple-100 text-sm">Guidance on Shmiras HaLashon</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChatbot(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex flex-col h-[60vh]">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50/30 to-blue-50/30">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-blue-600 text-white ml-4'
                          : 'bg-white border border-purple-200 shadow-sm mr-4'
                      }`}
                    >
                      {!message.isUser && (
                        <div className="flex items-center gap-2 mb-2">
                          <img 
                            src="/chofetz_chaim.png" 
                            alt="Chofetz Chaim" 
                            className="w-6 h-8 object-contain"
                            style={{ background: 'transparent' }}
                          />
                          <span className="text-xs font-semibold text-purple-700">
                            The Chofetz Chaim
                          </span>
                        </div>
                      )}
                      <p className={`text-sm leading-relaxed ${message.isUser ? 'text-white' : 'text-gray-800'}`}>
                        {message.text}
                      </p>
                      <p className={`text-xs mt-2 ${message.isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-purple-200 shadow-sm mr-4 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <img 
                          src="/chofetz_chaim.png" 
                          alt="Chofetz Chaim" 
                          className="w-6 h-8 object-contain"
                          style={{ background: 'transparent' }}
                        />
                        <span className="text-xs font-semibold text-purple-700">
                          The Chofetz Chaim
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-purple-200 p-4 bg-white">
                <div className="flex gap-2">
                  <Textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask the Chofetz Chaim about Shmiras HaLashon... (e.g., 'How can I avoid lashon hara at work?')"
                    className="flex-1 min-h-[60px] border-purple-300 focus:border-purple-500 focus:ring-purple-500 resize-none"
                    disabled={chatLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!userMessage.trim() || chatLoading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearMessages}
                    className="text-xs"
                  >
                    Clear Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
