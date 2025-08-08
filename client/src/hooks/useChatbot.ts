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

    // Load API keys from Vite env
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;

    let reply = '';
    let usedProvider = '';

    // Try Gemini REST API first
    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: content }] }]
            })
          }
        );
        const data = await response.json();
        reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        usedProvider = 'gemini';
      } catch (err) {
        console.error('Gemini API error:', err);
      }
    }

    // If Gemini failed or no key, try OpenAI
    if (!reply && openaiKey) {
      try {
        const response = await fetch(
          'https://api.openai.com/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{ role: 'user', content }],
              temperature: 0.7
            })
          }
        );
        const data = await response.json();
        reply = data?.choices?.[0]?.message?.content || '';
        usedProvider = 'openai';
      } catch (err) {
        console.error('OpenAI API error:', err);
      }
    }

    // If both fail, show unavailable
    if (!reply) {
      console.error('No valid API key or both providers failed');
      reply = 'Bot unavailable. Please contact support.';
      usedProvider = 'none';
    }

    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        content: reply,
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
    ]);
    setIsTyping(false);
    return;
  };

  return {
    messages,
    sendMessage,
    isTyping,
    aiProvider,
    setAIProvider
  };
}
