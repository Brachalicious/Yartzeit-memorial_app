import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageSquare, Calendar as CalendarIcon, Edit, Plus } from 'lucide-react';
import { ShmirasHalashonForm } from './ShmirasHalashonForm';
import { ShmirasHalashonProgress } from './ShmirasHalashonProgress';
import { ShmirasHalashonHistory } from './ShmirasHalashonHistory';
import { useShmirasHalashon } from '@/hooks/useShmirasHalashon';
import { cn } from '@/lib/utils';

interface ShmirasHalashonSectionProps {
  onComplete?: () => void;
}

export function ShmirasHalashonSection({ onComplete }: ShmirasHalashonSectionProps) {
  const { entries, stats, loading, error, createEntry, updateEntry, deleteEntry, getEntryByDate } = useShmirasHalashon();
  const [activeTab, setActiveTab] = React.useState<'today' | 'progress' | 'history'>('today');
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedEntry, setSelectedEntry] = React.useState(null);
  const [showCalendar, setShowCalendar] = React.useState(false);

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
    </div>
  );
}
