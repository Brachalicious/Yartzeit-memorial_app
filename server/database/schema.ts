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

export interface DatabaseSchema {
  yahrzeit_entries: YahrzeitEntry;
  letters: Letter;
}
