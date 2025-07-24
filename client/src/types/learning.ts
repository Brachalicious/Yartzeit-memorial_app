export interface LearningActivity {
  id: number;
  activity_type: 'tehillim' | 'torah';
  title: string;
  description: string | null;
  date_completed: string;
  notes: string | null;
  created_at: string;
}

export interface LearningActivityFormData {
  activity_type: 'tehillim' | 'torah';
  title: string;
  description: string | null;
  date_completed: string;
  notes: string | null;
}
