export interface TehillimChapter {
  id: number;
  chapter_number: number;
  chapter_name: string | null;
  date_completed: string;
  notes: string | null;
  created_at: string;
}

export interface TehillimChapterFormData {
  chapter_number: number;
  chapter_name?: string;
  date_completed: string;
  notes?: string;
}

export interface TehillimProgress {
  total_chapters: number;
  completed_count: number;
  remaining_count: number;
  completed_chapters: number[];
  remaining_chapters: number[];
  progress_percentage: number;
}
