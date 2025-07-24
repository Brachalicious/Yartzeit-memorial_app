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

export interface UpcomingYahrzeit extends YahrzeitEntry {
  yahrzeit_date: string;
  hebrew_yahrzeit_date: string;
  days_until: number;
  is_soon: boolean;
}

export interface YahrzeitFormData {
  name: string;
  hebrew_name: string;
  death_date: string;
  relationship: string;
  notes: string;
  notify_days_before: number;
}
