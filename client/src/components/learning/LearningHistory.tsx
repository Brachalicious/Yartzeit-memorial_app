import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningActivity } from '@/types/learning';
import { Trash2, Calendar, BookOpen, Heart } from 'lucide-react';

interface LearningHistoryProps {
  activities: LearningActivity[];
  onDelete: (id: number) => void;
}

export function LearningHistory({ activities, onDelete }: LearningHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this learning activity?')) {
      onDelete(id);
    }
  };

  const groupedActivities = React.useMemo(() => {
    const groups: { [key: string]: LearningActivity[] } = {};
    
    activities.forEach(activity => {
      const date = activity.date_completed;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });
    
    return Object.entries(groups).sort(([dateA], [dateB]) => 
      new Date(dateB).getTime() - new Date(dateA).getTime()
    );
  }, [activities]);

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No learning activities recorded yet. Start by dedicating some Tehillim or Torah learning!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Learning History</h2>
        <p className="text-muted-foreground mt-2">
          {activities.length} activities dedicated to Chaya Sara Leah's memory
        </p>
      </div>

      <div className="grid gap-4">
        {groupedActivities.map(([date, dayActivities]) => (
          <Card key={date}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                {formatDate(date)}
                <span className="text-sm text-muted-foreground font-normal">
                  ({dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {dayActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-4 rounded-lg border ${
                    activity.activity_type === 'tehillim'
                      ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                      : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {activity.activity_type === 'tehillim' ? (
                          <Heart className="h-4 w-4 text-red-500" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-blue-600" />
                        )}
                        <h3 className="font-semibold">{activity.title}</h3>
                      </div>
                      
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {activity.description}
                        </p>
                      )}
                      
                      {activity.notes && (
                        <div className="mt-3 p-3 bg-white/50 dark:bg-black/20 rounded text-sm">
                          <strong>Notes:</strong> {activity.notes}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(activity.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
