import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Heart, Plus, MessageSquare } from 'lucide-react';
import { TehillimSection } from '@/components/learning/TehillimSection';
import { TorahSection } from '@/components/learning/TorahSection';
import { LearningHistory } from '@/components/learning/LearningHistory';
import { ShmirasHalashonSection } from '@/components/shmiras-halashon/ShmirasHalashonSection';
import { useLearning } from '@/hooks/useLearning';

export function LearningPage() {
  const { activities, loading, error, createActivity, deleteActivity } = useLearning();
  const [activeTab, setActiveTab] = React.useState<'tehillim' | 'torah' | 'shmiras-halashon' | 'history'>('tehillim');

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            Loading learning activities...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center text-red-600">
            Error: {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent mb-2">
          ליועלי נשמת חיה שרה לאה בת אורי
        </h1>
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-3">
          Torah Learning, Tehillim & Shmiras HaLashon
        </h2>
        <p className="text-lg text-blue-600 dark:text-blue-400 italic">
          Dedicate your learning, prayers, and mindful speech to elevate her holy soul
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <Button
            variant={activeTab === 'tehillim' ? 'default' : 'outline'}
            onClick={() => setActiveTab('tehillim')}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            Say Tehillim
          </Button>
          <Button
            variant={activeTab === 'torah' ? 'default' : 'outline'}
            onClick={() => setActiveTab('torah')}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Learn Torah
          </Button>
          <Button
            variant={activeTab === 'shmiras-halashon' ? 'default' : 'outline'}
            onClick={() => setActiveTab('shmiras-halashon')}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Guard Speech
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            History
          </Button>
        </div>

        {activeTab === 'tehillim' && (
          <TehillimSection onComplete={createActivity} />
        )}

        {activeTab === 'torah' && (
          <TorahSection onComplete={createActivity} />
        )}

        {activeTab === 'shmiras-halashon' && (
          <ShmirasHalashonSection />
        )}

        {activeTab === 'history' && (
          <LearningHistory activities={activities} onDelete={deleteActivity} />
        )}
      </div>
    </div>
  );
}
