export interface Letter {
  id: number;
  content: string;
  mailbox?: string;
  recipient?: string;
  sender?: string;
  created_at: string;
}

export interface LetterFormData {
  content: string;
  mailbox?: string;
  recipient?: string;
  sender?: string;
}
