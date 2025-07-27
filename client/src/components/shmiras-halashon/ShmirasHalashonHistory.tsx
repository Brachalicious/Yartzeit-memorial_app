import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShmirasHalashonEntry } from '@/types/shmiras-halashon';
import { Trash2, Calendar, Star, MessageSquare, Heart, BookOpen, Users } from 'lucide-react';

interface ShmirasHalashonHistoryProps {
  entries: ShmirasHalashonEntry[];
  onDelete: (id: number) => void;
}

export function ShmirasHalashonHistory({ entries, onDelete }: ShmirasHalashonHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this Shmiras HaLashon entry?')) {
      onDelete(id);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 4) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (rating >= 3) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No Shmiras HaLashon entries recorded yet. Start by adding your first daily reflection!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Shmiras HaLashon History</h2>
        <p className="text-muted-foreground mt-2">
          {entries.length} days of speech awareness in memory of Chaya Sara Leah
        </p>
      </div>

      <div className="grid gap-4">
        {entries.map((entry) => (
          <Card key={entry.id} className={getRatingBg(entry.overall_rating)}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5" />
                    {formatDate(entry.date_recorded)}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className={`h-4 w-4 ${getRatingColor(entry.overall_rating)}`} />
                    <span className={`font-medium ${getRatingColor(entry.overall_rating)}`}>
                      {entry.overall_rating}/5 Overall Rating
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(entry.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-medium">{entry.positive_speech_count}</div>
                    <div className="text-xs text-muted-foreground">Positive words</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="font-medium">{entry.gave_compliments}</div>
                    <div className="text-xs text-muted-foreground">Compliments</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">{entry.spoke_words_of_torah}</div>
                    <div className="text-xs text-muted-foreground">Torah words</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="font-medium">{entry.helped_through_speech}</div>
                    <div className="text-xs text-muted-foreground">Helped others</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <div>
                    <div className="font-medium">{entry.avoided_lashon_hara}</div>
                    <div className="text-xs text-muted-foreground">Avoided negativity</div>
                  </div>
                </div>
              </div>

              {/* Goals and Reflections */}
              {(entry.daily_goal || entry.challenges_faced || entry.improvements_noticed || entry.reflection_notes) && (
                <div className="space-y-3 pt-3 border-t">
                  {entry.daily_goal && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Daily Goal:</h4>
                      <p className="text-sm text-muted-foreground bg-white/50 dark:bg-black/20 p-2 rounded">
                        {entry.daily_goal}
                      </p>
                    </div>
                  )}
                  
                  {entry.challenges_faced && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Challenges Faced:</h4>
                      <p className="text-sm text-muted-foreground bg-white/50 dark:bg-black/20 p-2 rounded">
                        {entry.challenges_faced}
                      </p>
                    </div>
                  )}
                  
                  {entry.improvements_noticed && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Improvements Noticed:</h4>
                      <p className="text-sm text-muted-foreground bg-white/50 dark:bg-black/20 p-2 rounded">
                        {entry.improvements_noticed}
                      </p>
                    </div>
                  )}
                  
                  {entry.reflection_notes && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Daily Reflection:</h4>
                      <p className="text-sm text-muted-foreground bg-white/50 dark:bg-black/20 p-2 rounded">
                        {entry.reflection_notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
