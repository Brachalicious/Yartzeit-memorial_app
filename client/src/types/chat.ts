export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  aiProvider?: 'openai' | 'gemini';
}

export type AIProvider = 'openai' | 'gemini';

export interface ChatSettings {
  aiProvider: AIProvider;
}
