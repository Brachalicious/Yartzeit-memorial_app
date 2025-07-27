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

export interface ShmirasHalashonFormData {
  date_recorded: string;
  positive_speech_count: number;
  avoided_lashon_hara: number;
  gave_compliments: number;
  spoke_words_of_torah: number;
  helped_through_speech: number;
  reflection_notes?: string;
  daily_goal?: string;
  challenges_faced?: string;
  improvements_noticed?: string;
  overall_rating: number;
}

export interface ShmirasHalashonStats {
  total_days_tracked: number;
  average_rating: number;
  total_positive_speech: number;
  total_avoided_lashon_hara: number;
  total_compliments: number;
  total_torah_words: number;
  total_helped_through_speech: number;
  current_streak: number;
  recent_entries: number;
}
