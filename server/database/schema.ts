export interface YahrzeitEntry {
  id: number;
  name: string;
  hebrew_name: string | null;
  death_date: string;
  hebrew_death_date: string;
  relationship: string | null;
  notes: string | null;
  notify_days_before: number;
  created_at: string;
  updated_at: string;
}

export interface Letter {
  id: number;
  content: string;
  created_at: string;
}

export interface LearningActivity {
  id: number;
  activity_type: 'tehillim' | 'torah';
  title: string;
  description: string | null;
  date_completed: string;
  notes: string | null;
  created_at: string;
}

export interface TehillimChapter {
  id: number;
  chapter_number: number;
  chapter_name: string | null;
  date_completed: string;
  notes: string | null;
  created_at: string;
}

export interface ShmirasHalashonEntry {
  id: number;
  date_recorded: string;
  positive_speech_count: number;
  avoided_lashon_hara: number;
  gave_compliments: number;
  spoke_words_of_torah: number;
  helped_through_speech: number;
  reflection_notes: string | null;
  daily_goal: string | null;
  challenges_faced: string | null;
  improvements_noticed: string | null;
  overall_rating: number;
  created_at: string;
}

export interface DatabaseSchema {
  yahrzeit_entries: YahrzeitEntry;
  letters: Letter;
  learning_activities: LearningActivity;
  tehillim_chapters: TehillimChapter;
  shmiras_halashon_entries: ShmirasHalashonEntry;
}
