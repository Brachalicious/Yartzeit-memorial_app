import { useState } from 'react';

interface ChofetzChaimMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function useChofetzChaim() {
  const [messages, setMessages] = useState<ChofetzChaimMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (userMessage: string): Promise<void> => {
    if (!userMessage.trim()) return;

    const userMsg: ChofetzChaimMessage = {
      id: `user-${Date.now()}`,
      text: userMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chofetz-chaim/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      const botMsg: ChofetzChaimMessage = {
        id: `bot-${Date.now()}`,
        text: data.response || data.fallback || 'I apologize, but I cannot respond right now.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);

    } catch (err) {
      console.error('Error sending message to Chofetz Chaim:', err);
      setError('Failed to send message. Please try again.');
      
      // Add fallback response
      const fallbackMsg: ChofetzChaimMessage = {
        id: `fallback-${Date.now()}`,
        text: 'My dear friend, I apologize for the difficulty. Remember that every moment you guard your speech is precious. May your words today bring only blessing and healing to the world, in memory of Chaya Sara Leah Bas Uri zt"l.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDailyEncouragement = async (): Promise<string> => {
    try {
      const response = await fetch('/api/chofetz-chaim/daily-encouragement');
      
      if (!response.ok) {
        throw new Error('Failed to get daily encouragement');
      }

      const data = await response.json();
      return data.encouragement || data.fallback || 'May your speech today be a source of blessing!';

    } catch (err) {
      console.error('Error getting daily encouragement:', err);
      return 'Good morning, my dear friend! Today is a beautiful opportunity to practice Shmiras HaLashon. May your words bring blessing and light to the world, in memory of Chaya Sara Leah Bas Uri zt"l.';
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  const addInitialGreeting = () => {
    const greeting: ChofetzChaimMessage = {
      id: `greeting-${Date.now()}`,
      text: `Shalom, my dear friend! I am here to help you with questions about Shmiras HaLashon - the mitzvah of guarding your speech. Whether you need guidance about specific situations, encouragement in your spiritual journey, or want to learn the halachos of proper speech, I'm here to assist you with warmth and wisdom. 

What would you like to discuss today? 🕯️`,
      isUser: false,
      timestamp: new Date()
    };
    setMessages([greeting]);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    getDailyEncouragement,
    clearMessages,
    addInitialGreeting
  };
}
