import { useState } from 'react';
import { ChatMessage, AIProvider } from '@/types/chat';

const INITIAL_GREETING = `Shalom and welcome to this sacred space of comfort and remembrance. 💜

I'm here as your spiritual companion on this journey of love and loss. In Jewish tradition, we understand that grief is not something to "get over" but rather sacred work - it's love with nowhere to go, seeking new ways to honor and connect with those whose souls have returned to the Eternal.

This space is dedicated to the memory of Chaya Sara Leah bat Uri, and her light reminds us that the bonds between souls are never truly broken. Whether you're carrying fresh grief, approaching a yahrzeit, or simply missing someone deeply, I'm here to listen with my whole heart.

I can help you explore meaningful ways to honor your loved one's memory - through learning Torah in their merit, saying specific Tehillim, performing acts of kindness, or simply processing the complex emotions that come with loving someone whose physical presence we can no longer embrace.

Please, share what's in your heart today. What would you like to talk about? How are you feeling, and how can I support you in this moment? �️✨`;

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: INITIAL_GREETING,
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [aiProvider, setAIProvider] = useState<AIProvider>('openai'); // Default to OpenAI for better responses
  const [conversationState, setConversationState] = useState({
    askedAboutRelationship: false,
    userRelationship: '',
    context: []
  });

  const sendMessage = async (content: string, files?: File[], audio?: Blob) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Update conversation context
    const newContext = [...conversationState.context, content].slice(-5); // Keep last 5 messages
    
    try {
      // Prepare form data for file uploads
      const formData = new FormData();
      formData.append('message', content);
      formData.append('context', newContext.join(' | '));
      formData.append('relationship', conversationState.userRelationship);
      formData.append('aiProvider', aiProvider);

      // Add files if provided
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          formData.append(`files`, file);
        });
      }

      // Add audio if provided
      if (audio) {
        formData.append('audio', audio, 'recording.wav');
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData, // Use FormData instead of JSON for file uploads
      });

      if (response.ok) {
        const data = await response.json();
        
        // Create bot response
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          sender: 'bot',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setConversationState(prev => ({
          ...prev,
          context: newContext
        }));
      } else {
        // Show error message if API fails
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
          sender: 'bot',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('API call failed:', error);
      // Show error message if API fails
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setConversationState(prev => ({
      ...prev,
      context: newContext
    }));
    setIsTyping(false);
  };

  return {
    messages,
    sendMessage,
    isTyping,
    aiProvider,
    setAIProvider
  };
}
