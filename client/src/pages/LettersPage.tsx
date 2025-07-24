import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Heart, Send } from 'lucide-react';
import { useLetters } from '@/hooks/useLetters';
import { LettersList } from '@/components/letters/LettersList';

export function LettersPage() {
  const [letter, setLetter] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const { letters, loading, error, createLetter, deleteLetter } = useLetters();

  const handleSend = async () => {
    if (!letter.trim()) return;
    
    setSending(true);
    
    try {
      // Simulate sending time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save the letter
      await createLetter({ content: letter });
      
      // Clear the form
      setLetter('');
    } catch (error) {
      console.error('Error sending letter:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            Loading letters...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center text-red-600">
            Error: {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Heart className="h-8 w-8 text-red-500" />
          Liulei Nishmas Chaya Sara Leah Bas Uri
        </h2>
        <p className="text-muted-foreground mt-2">
          Write a heartfelt message to send to heaven
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Write Your Letter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="letter">Dear Chaya Sara Leah,</Label>
              <Textarea
                id="letter"
                placeholder="Share your thoughts, memories, or just say hello..."
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSend}
                disabled={!letter.trim() || sending}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {sending ? 'Sending to heaven...' : 'Send Letter'}
              </Button>
            </div>

            {sending && (
              <div className="text-center text-muted-foreground">
                <p>Your message is being delivered with love...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <LettersList letters={letters} onDelete={deleteLetter} />
      </div>
    </div>
  );
}
