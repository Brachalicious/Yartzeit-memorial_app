import { useState } from 'react';
import { ChatMessage } from '@/types/chat';

const COMFORT_RESPONSES = {
  grief: [
    "I understand you're going through such a difficult time. Losing a mother is one of life's most profound losses. Your pain is real and valid, and it's okay to feel overwhelmed by grief.",
    
    "The love between a mother and child is sacred and eternal. Even though she's no longer physically here, that love continues to live within you and guide you.",
    
    "Grief is love with nowhere to go. What you're feeling shows the depth of your connection with your mother. Allow yourself to feel everything - the sadness, the anger, the longing - it's all part of healing.",
    
    "Your mother's soul was special, and the fact that you're here, seeking comfort and remembering her, shows how beautifully she raised you. Her essence lives on through you."
  ],
  
  souls: [
    "Special souls like your mother come to this world with a unique mission. They touch lives in profound ways, often giving more love than they receive. Their time here may seem too short, but their impact is eternal.",
    
    "In Jewish tradition, we believe that some souls are so refined they don't need to stay long in this world. They complete their purpose quickly because they're already so close to perfection.",
    
    "Your mother's neshomah (soul) was pure and beautiful. Now that she's returned to her Source, she continues to watch over you and send you blessings from above.",
    
    "The brightest stars burn the most intensely. Your mother's soul shone so brightly in this world, and now she illuminates the heavens."
  ],
  
  memory: [
    "Honoring her memory means living the values she taught you. Every act of kindness you do, every moment of joy you embrace, every life you touch - that's her legacy continuing through you.",
    
    "Light candles in her memory, give charity in her name, share stories about her with others. These mitzvot (good deeds) elevate her soul and keep her memory alive.",
    
    "The best way to honor a special soul is to become the person they believed you could be. Your mother saw greatness in you - now it's time to see it in yourself.",
    
    "Create rituals that connect you to her: cook her favorite recipes, visit places she loved, or simply talk to her. The connection between souls transcends physical boundaries."
  ],
  
  comfort: [
    "You are not alone in this journey. Your mother's love surrounds you always, and there are people here who care about your healing.",
    
    "Healing doesn't mean forgetting - it means learning to carry your love for her in a way that brings you peace rather than only pain.",
    
    "Take your time with grief. There's no timeline for healing from such a profound loss. Be gentle with yourself.",
    
    "Your tears honor her memory. In Jewish tradition, we say that tears are prayers - and your prayers reach her soul."
  ],
  
  default: [
    "I'm here to listen and offer comfort. Losing someone so precious is never easy, and your feelings are completely valid.",
    
    "Would you like to share a memory of your mother? Sometimes talking about the beautiful moments can bring both tears and healing.",
    
    "Remember that grief is a reflection of love. The depth of your sorrow shows the depth of your connection with her.",
    
    "Your mother's soul continues to shine. She may be in a different realm now, but the love you shared transcends all boundaries."
  ]
};

const getResponseCategory = (input: string): keyof typeof COMFORT_RESPONSES => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('grief') || lowerInput.includes('struggling') || lowerInput.includes('pain') || lowerInput.includes('hurt') || lowerInput.includes('difficult')) {
    return 'grief';
  }
  
  if (lowerInput.includes('soul') || lowerInput.includes('special') || lowerInput.includes('heaven') || lowerInput.includes('spiritual')) {
    return 'souls';
  }
  
  if (lowerInput.includes('memory') || lowerInput.includes('honor') || lowerInput.includes('remember') || lowerInput.includes('legacy')) {
    return 'memory';
  }
  
  if (lowerInput.includes('comfort') || lowerInput.includes('help') || lowerInput.includes('support') || lowerInput.includes('lonely')) {
    return 'comfort';
  }
  
  return 'default';
};

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Shalom and welcome. I'm here to offer comfort and share wisdom about the special souls we love and miss. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    // Get appropriate response
    const category = getResponseCategory(content);
    const responses = COMFORT_RESPONSES[category];
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: response,
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  return {
    messages,
    sendMessage,
    isTyping
  };
}
