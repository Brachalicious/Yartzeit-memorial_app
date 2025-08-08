import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BookOpen, Heart, Plus, MessageSquare } from 'lucide-react';
import { TehillimSection } from '@/components/learning/TehillimSection';
import { TorahSection } from '@/components/learning/TorahSection';
import { LearningHistory } from '@/components/learning/LearningHistory';
import { SharedLearningSection } from '@/components/learning/SharedLearningSection';
import { ShmirasHalashonSection } from '@/components/shmiras-halashon/ShmirasHalashonSection';
import { useLearning } from '@/hooks/useLearning';
import { useTehillim } from '@/hooks/useTehillim';

export function LearningPage() {
  const { activities, loading, error, createActivity, deleteActivity } = useLearning();
  const { chapters: tehillimChapters, progress: tehillimProgress, loading: tehillimLoading, deleteChapter } = useTehillim();
  const [activeTab, setActiveTab] = React.useState<'tehillim' | 'torah' | 'shmiras-halashon' | 'shared-learning' | 'history'>('tehillim');
  const [tehillimSubTab, setTehillimSubTab] = React.useState<'individual' | 'full-book' | 'progress' | 'history'>('individual');

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
          ליועלי נשמת חיה שרה לאה בת אורי ז״ל
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
            variant={activeTab === 'shared-learning' ? 'default' : 'outline'}
            onClick={() => setActiveTab('shared-learning')}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            Shared Learning
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
          <div className="space-y-6">
            {/* Tehillim Sub-tabs */}
            <div className="flex flex-wrap gap-2 justify-center bg-gradient-to-r from-blue-50 to-amber-50 p-4 rounded-lg">
              <Button
                variant={tehillimSubTab === 'individual' ? 'default' : 'outline'}
                onClick={() => setTehillimSubTab('individual')}
                className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white"
                size="sm"
              >
                📖 Individual Chapters
              </Button>
              <Button
                variant={tehillimSubTab === 'full-book' ? 'default' : 'outline'}
                onClick={() => setTehillimSubTab('full-book')}
                className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white"
                size="sm"
              >
                📚 Full Book of Psalms
              </Button>
              <Button
                variant={tehillimSubTab === 'progress' ? 'default' : 'outline'}
                onClick={() => setTehillimSubTab('progress')}
                className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white"
                size="sm"
              >
                📊 Progress Tracker
              </Button>
              <Button
                variant={tehillimSubTab === 'history' ? 'default' : 'outline'}
                onClick={() => setTehillimSubTab('history')}
                className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white"
                size="sm"
              >
                📋 History
              </Button>
            </div>

            {/* Tehillim Content based on sub-tab */}
            {tehillimSubTab === 'individual' && (
              <TehillimSection onComplete={createActivity} />
            )}
            
            {tehillimSubTab === 'full-book' && (
              <Card className="bg-gradient-to-r from-blue-50 to-amber-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent text-center">
                    📚 Complete Book of Psalms
                  </CardTitle>
                  <p className="text-center bg-gradient-to-r from-blue-700 to-amber-700 bg-clip-text text-transparent">
                    Read the entire Sefer Tehillim in memory of Chaya Sara Leah Bas Uri זצ״ל
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <p className="bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent font-medium">
                      Choose how you'd like to access the complete Book of Psalms
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() => window.open('https://www.sefaria.org/texts/Tanakh/Ketuvim/Psalms', '_blank')}
                        className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white"
                      >
                        📖 Sefaria - Hebrew & English
                      </Button>
                      <Button
                        onClick={() => window.open('https://www.chabad.org/library/bible_cdo/aid/16222/showrashi/true', '_blank')}
                        className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white"
                      >
                        📜 Chabad.org - With Commentary
                      </Button>
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm bg-gradient-to-r from-blue-700 to-amber-700 bg-clip-text text-transparent font-medium">
                        💡 Tip: Reading the complete Tehillim brings tremendous merit to the neshomah. 
                        Each word carries holy power to elevate her soul in Gan Eden.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {tehillimSubTab === 'progress' && (
              <Card className="bg-gradient-to-r from-blue-50 to-amber-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                    📊 Tehillim Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tehillimProgress ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                          {tehillimProgress.completed_count || 0}/{tehillimProgress.total_chapters || 150} Chapters Completed
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-amber-600 h-4 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${tehillimProgress.progress_percentage || 0}%`
                            }}
                          ></div>
                        </div>
                        <p className="mt-2 text-sm bg-gradient-to-r from-blue-700 to-amber-700 bg-clip-text text-transparent">
                          {tehillimProgress.progress_percentage || 0}% Complete
                        </p>
                      </div>
                      {tehillimProgress.remaining_chapters && tehillimProgress.remaining_chapters.length > 0 && (
                        <div className="mt-4">
                          <p className="font-medium mb-2 bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                            Remaining Chapters:
                          </p>
                          <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                            {tehillimProgress.remaining_chapters.slice(0, 30).join(', ')}
                            {tehillimProgress.remaining_chapters.length > 30 && '...'}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">Loading progress...</p>
                  )}
                </CardContent>
              </Card>
            )}
            
            {tehillimSubTab === 'history' && (
              <Card className="bg-gradient-to-r from-blue-50 to-amber-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                    📋 Completed Chapters History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tehillimChapters && tehillimChapters.length > 0 ? (
                    <div className="space-y-2">
                      {tehillimChapters.map((chapter) => (
                        <div key={chapter.id} className="flex justify-between items-center p-3 bg-white rounded border">
                          <div>
                            <span className="font-medium">Chapter {chapter.chapter_number}</span>
                            {chapter.chapter_name && <span className="text-gray-600"> - {chapter.chapter_name}</span>}
                            <div className="text-sm text-gray-500">
                              Completed: {new Date(chapter.date_completed).toLocaleDateString()}
                            </div>
                          </div>
                          <Button
                            onClick={() => deleteChapter(chapter.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">No chapters completed yet</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'torah' && (
          <TorahSection onComplete={createActivity} />
        )}

        {activeTab === 'shmiras-halashon' && (
          <ShmirasHalashonSection />
        )}

        {activeTab === 'shared-learning' && (
          <SharedLearningSection onComplete={() => {
            // Optional: refresh any data if needed
            console.log('Shared learning entry completed');
          }} />
        )}

        {activeTab === 'history' && (
          <LearningHistory activities={activities} onDelete={deleteActivity} />
        )}
      </div>
    </div>
  );
}
