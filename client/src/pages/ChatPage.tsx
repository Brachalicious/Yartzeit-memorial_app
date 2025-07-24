import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Heart } from 'lucide-react';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { useChatbot } from '@/hooks/useChatbot';

export function ChatPage() {
  const { messages, sendMessage, isTyping } = useChatbot();
  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    await sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
          Comfort & Guidance
        </h1>
        <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-3">
          A caring space for your heart
        </h2>
        <p className="text-lg text-purple-600 dark:text-purple-400 italic">
          Share your feelings and find comfort in wisdom about special souls
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple-600" />
              Comfort Companion
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              A gentle space to process grief and find comfort
            </p>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  Comfort Companion is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your heart..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("I'm struggling with losing my mother")}
                className="text-xs"
              >
                I'm struggling with grief
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("Tell me about special souls")}
                className="text-xs"
              >
                Tell me about special souls
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("How do I honor her memory?")}
                className="text-xs"
              >
                How to honor her memory
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
