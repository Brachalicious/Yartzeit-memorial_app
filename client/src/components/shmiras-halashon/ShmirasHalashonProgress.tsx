import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShmirasHalashonStats } from '@/types/shmiras-halashon';
import { TrendingUp, Calendar, MessageSquare, Heart, BookOpen, Users, Flame } from 'lucide-react';
import ChofetzPortrait from "@/components/ChofetzPortrait";

interface ShmirasHalashonProgressProps {
  stats: ShmirasHalashonStats;
}

export function ShmirasHalashonProgress({ stats }: ShmirasHalashonProgressProps) {
  const progressPercentage = Math.min((stats.average_rating / 5) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Chofetz Chaim greeting and image - only once, force large size with inline styles */}
      <div className="flex flex-col items-center mb-6">
        <ChofetzPortrait size={700} className="mx-auto" />
        <div className="text-3xl font-bold text-blue-900 mb-2">Chofetz Chaim</div>
        <div className="text-lg text-gray-700 text-center max-w-2xl">
          Shalom, my dear friend! I am here to help you with questions about Shmiras HaLashon - the mitzvah of guarding your speech. Whether you need guidance about specific situations, encouragement in your spiritual journey, or want to learn the halachos of proper speech, I'm here to assist you with warmth and wisdom. What would you like to discuss today? 🕯️
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Shmiras HaLashon Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {stats.average_rating.toFixed(1)}/5.0
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              Average Speech Rating
            </div>
            <Progress value={progressPercentage} className="w-full" />
            <div className="text-sm text-muted-foreground mt-2">
              {progressPercentage.toFixed(0)}% towards perfect speech
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div className="font-bold text-xl">{stats.total_days_tracked}</div>
              <div className="text-sm text-muted-foreground">Days Tracked</div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <Flame className="h-6 w-6 text-orange-600" />
              <div className="font-bold text-xl">{stats.current_streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <MessageSquare className="h-6 w-6 text-green-600" />
              <div className="font-bold text-xl">{stats.total_positive_speech}</div>
              <div className="text-sm text-muted-foreground">Positive Words</div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              <div className="font-bold text-xl">{stats.total_compliments}</div>
              <div className="text-sm text-muted-foreground">Compliments</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Torah Speech
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {stats.total_torah_words}
            </div>
            <div className="text-sm text-muted-foreground">
              Times shared Torah wisdom
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Helping Others
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {stats.total_helped_through_speech}
            </div>
            <div className="text-sm text-muted-foreground">
              Times helped through speech
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Avoided Negativity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {stats.total_avoided_lashon_hara}
            </div>
            <div className="text-sm text-muted-foreground">
              Times avoided lashon hara
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.current_streak >= 7 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Flame className="h-6 w-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-300">
                Amazing Streak! 🔥
              </h3>
            </div>
            <p className="text-orange-600 dark:text-orange-400">
              You've been tracking your speech for {stats.current_streak} consecutive days! 
              Your dedication to improving your speech in memory of Chaya Sara Leah is truly inspiring.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
