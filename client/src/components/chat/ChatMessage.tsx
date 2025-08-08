import * as React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 flex items-center justify-center ${
        isBot 
          ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' 
          : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
      }`}>
        {isBot 
          ? <img src="/chofetz_chaim.svg" alt="Chofetz Chaim Bot" className="block mx-auto object-contain" style={{ width: 500, height: 500 }} />
          : <User className="h-[300px] w-[300px]" />}
      </div>
      
      <div className={`max-w-[80%] rounded-lg p-3 ${
        isBot 
          ? 'bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-100' 
          : 'bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100'
      }`}>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
