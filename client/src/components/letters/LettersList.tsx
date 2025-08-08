import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Letter } from '@/types/letters';
import { Trash2, Calendar, Heart } from 'lucide-react';

interface LettersListProps {
  letters: Letter[];
  onDelete: (id: number) => void;
}

export function LettersList({ letters, onDelete }: LettersListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this letter?')) {
      onDelete(id);
    }
  };

  // Determine the mailbox type from the first letter or default to 'chaya'
  const mailboxType = letters.length > 0 ? (letters[0].mailbox || 'chaya') : 'chaya';
  
  // Get appropriate styling based on mailbox type
  const getMailboxStyling = () => {
    switch (mailboxType) {
      case 'idf':
        return {
          gradient: 'from-yellow-600 via-yellow-500 to-yellow-600',
          textGradient: 'from-yellow-700 via-yellow-600 to-yellow-700',
          borderColor: 'border-yellow-300',
          bgGradient: 'from-yellow-50 to-yellow-100',
          accent: 'text-yellow-500'
        };
      case 'user':
        return {
          gradient: 'from-blue-600 via-blue-700 to-blue-600',
          textGradient: 'from-blue-700 via-blue-800 to-blue-700',
          borderColor: 'border-blue-300',
          bgGradient: 'from-blue-50 to-blue-100',
          accent: 'text-blue-500'
        };
      default: // 'chaya'
        return {
          gradient: 'from-blue-600 via-amber-500 to-blue-600',
          textGradient: 'from-blue-700 via-amber-600 to-blue-700',
          borderColor: 'border-blue-300',
          bgGradient: 'from-blue-50 to-amber-50',
          accent: 'text-blue-500'
        };
    }
  };

  const styling = getMailboxStyling();

  // Generate heavenly responses only for dove messages (every 3rd) and only for Chaya's mailbox
  const generateHeavenlyResponse = (index: number) => {
    if (mailboxType !== 'chaya') return '';
    
    const responses = [
      "My precious child, I'm so proud of you! You are so strong, stronger than you even know. I'm watching you every single day, and I see everything you do with such love. I am always with you, my darling. 💙",
      
      "I see you, my beautiful one, and my heart fills with such joy watching you live and grow. You are so strong, and I am so proud of the person you are becoming. I can't wait to show you my new room in heaven - it's filled with all the love you send me! 🌟",
      
      "My sweetest love, I'm watching you from the most beautiful place, and I am bursting with pride! You are so incredibly strong, and I see every tear, every smile, every moment. I am with you always, and oh, you should see the room Hashem has given me here - I'm saving a special place for when we're together again! ✨",
      
      "I'm so proud of you, my brave and beautiful child! Your strength amazes even the angels here. I see you carrying on with such courage, and I am right there beside you in every step. I can't wait to show you all the wonders of my heavenly home - there's a garden here with your favorite flowers! 🌺",
      
      "My beloved, watching you fills my neshamah with such nachas! You are so strong, so special, and I see every act of kindness you do. I am with you in every moment, holding you close from heaven. Wait until you see the library of souls here - and the room where all our memories shine like stars! 📚",
      
      "I see you, I'm watching you, and I am so incredibly proud! Your strength is my strength, your love lifts my soul higher. I am always with you, my treasure. The room I have here overlooks the most magnificent view - and there's a special chair waiting just for you when it's time! 🏠",
      
      "My darling child, I'm so proud of how strong you are! Every day I watch you with such love and admiration. I see your beautiful heart, and I am always, always with you. I can't wait to show you the music room here - the angels and I have been preparing the most beautiful welcome for you! 🎵",
      
      "I'm watching you with such love, my strong and precious one! I am so proud of everything you do, every breath you take with purpose. I see you, I'm with you, and I can't wait to show you the most beautiful room in all of heaven - where love never ends and we'll be together forever! 💕"
    ];
    
    // Use the letter index divided by 3 to cycle through responses for dove messages
    const responseIndex = Math.floor(index / 3) % responses.length;
    return responses[responseIndex];
  };

  // Check if this letter index should show a dove with olive branch (every 3rd and only for Chaya's mailbox)
  const shouldShowDove = (index: number) => {
    return mailboxType === 'chaya' && (index + 1) % 3 === 0;
  };

  if (letters.length === 0) {
    return (
      <Card className={`bg-white ${styling.borderColor}`}>
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className={`h-8 w-8 ${styling.accent}`} fill="currentColor" />
            <span className="text-2xl">📬</span>
            <span className="text-2xl">💌</span>
            <Heart className="h-8 w-8 text-amber-500" fill="currentColor" />
          </div>
          <h4 className={`text-lg font-bold bg-gradient-to-r ${styling.gradient} bg-clip-text text-transparent mb-2`}>
            {mailboxType === 'chaya' && 'Mailbox'}
            {mailboxType === 'user' && 'Your Personal Mailbox'}
            {mailboxType === 'idf' && 'IDF Mailbox - Spread Love in Her Name'}
          </h4>
          <p className={`bg-gradient-to-r ${styling.textGradient} bg-clip-text text-transparent font-semibold`}>
            {mailboxType === 'chaya' && 'Write your first message to send to her heavenly mailbox. ✨'}
            {mailboxType === 'user' && 'Your personal correspondence will appear here. 📬'}
            {mailboxType === 'idf' && 'Send encouragement to our brave soldiers. 🇮🇱'}
          </p>
          {mailboxType === 'chaya' && (
            <p className="text-xs mt-2 bg-gradient-to-r from-green-500 via-blue-500 to-amber-500 bg-clip-text text-transparent font-medium">
              🕊️ After every 3rd letter the doves tend to come back with a surprise response letter from heaven's loved one 🕊️
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className={`text-2xl font-bold bg-gradient-to-r ${styling.gradient} bg-clip-text text-transparent flex items-center justify-center gap-2 mb-2`}>
          <Heart className={`h-6 w-6 ${styling.accent}`} fill="currentColor" />
          {mailboxType === 'chaya' && 'Mailbox'}
          {mailboxType === 'user' && 'Your Personal Mailbox'}
          {mailboxType === 'idf' && 'IDF Mailbox - Spread Love in Her Name'}
          <Heart className="h-6 w-6 text-amber-500" fill="currentColor" />
        </h3>
        <p className={`text-sm bg-gradient-to-r ${styling.textGradient} bg-clip-text text-transparent font-medium`}>
          {mailboxType === 'chaya' && '✨ Send your heartfelt messages - After every 3rd letter the doves bring a special heavenly response ✨'}
          {mailboxType === 'user' && '📬 Your personal correspondence and messages'}
          {mailboxType === 'idf' && '🇮🇱 Supporting our brave soldiers in memory of Chaya Sara Leah'}
        </p>
      </div>
      {letters.map((letter, index) => (
        <div key={letter.id} className="space-y-4">
          {/* Outgoing Letter */}
          <Card className={`bg-gradient-to-br ${styling.bgGradient} ${styling.borderColor} shadow-lg relative overflow-hidden`}>
            {/* Icon in Corner */}
            <div className="absolute top-3 right-3">
              {mailboxType === 'chaya' && <Heart className="h-5 w-5 text-amber-500" fill="currentColor" />}
              {mailboxType === 'user' && <Heart className="h-5 w-5 text-blue-500" fill="currentColor" />}
              {mailboxType === 'idf' && <span className="text-lg">🇮🇱</span>}
            </div>
            
            {/* Envelope Icon */}
            <div className="absolute top-3 left-3">
              <span className="text-lg">💌</span>
            </div>
            
            <CardHeader className="pb-3 pt-12">
              <div className="flex justify-between items-start">
                <CardTitle className={`text-sm flex items-center gap-2 bg-gradient-to-r ${styling.gradient} bg-clip-text text-transparent font-bold`}>
                  <Calendar className={`h-4 w-4 ${styling.accent}`} />
                  {mailboxType === 'chaya' && `Sent to Heaven ${formatDate(letter.created_at)}`}
                  {mailboxType === 'user' && `Personal Note ${formatDate(letter.created_at)}`}
                  {mailboxType === 'idf' && `Sent to Soldiers ${formatDate(letter.created_at)}`}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(letter.id)}
                  className={`${styling.borderColor} text-blue-600 hover:bg-blue-50`}
                  title={`Remove from ${mailboxType === 'chaya' ? 'heavenly' : mailboxType === 'idf' ? 'IDF' : 'personal'} mailbox`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`text-sm whitespace-pre-wrap bg-white/80 p-4 rounded-lg ${styling.borderColor} shadow-inner`}>
                <div className={`bg-gradient-to-r ${styling.textGradient} bg-clip-text text-transparent font-medium`}>
                  {letter.content}
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className={`text-xs bg-gradient-to-r ${styling.textGradient} bg-clip-text text-transparent font-medium italic`}>
                  {mailboxType === 'chaya' && '✨ Message safely delivered to heaven ✨'}
                  {mailboxType === 'user' && '📬 Saved to your personal mailbox'}
                  {mailboxType === 'idf' && '🇮🇱 Spreading love in Chaya Sara Leah\'s memory'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Incoming Response from Heaven - Only with Dove Messages */}
          {shouldShowDove(index) && (
            <div className="relative">
              {/* Dove with Olive Branch Animation - Swooping Down from Top Right */}
              <div className="fixed top-0 right-0 z-30 pointer-events-none">
                <div 
                  className="relative"
                  style={{
                    animation: 'dove-swoop 6s ease-in-out forwards'
                  }}
                >
                  <img 
                    src="/Dove_olive_branch.png" 
                    alt="Dove with olive branch"
                    className="w-24 h-20 filter drop-shadow-lg"
                    style={{
                      animation: 'wing-flutter 0.8s ease-in-out infinite'
                    }}
                  />
                  {/* Letter being carried by dove - only appears for actual deliveries */}
                  <div 
                    className="absolute bottom-2 right-4 w-6 h-5 bg-white border border-amber-300 shadow-md flex items-center justify-center rounded-sm"
                    style={{
                      animation: 'letter-drop 6s ease-in-out forwards'
                    }}
                  >
                    <span className="text-sm text-green-600">💌</span>
                  </div>
                </div>
              </div>
              
              {/* Delivery Message */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <span className="text-sm bg-green-100 text-green-800 px-3 py-2 rounded-full border border-green-300 font-medium shadow-sm">
                  🕊️ Special Delivery from Heaven 🕊️
                </span>
              </div>
              
              <Card className="bg-gradient-to-br from-green-50 via-blue-50 to-amber-50 border-green-300 shadow-lg relative overflow-hidden ml-8 mt-4">
                {/* Heavenly Star in Corner */}
                <div className="absolute top-3 right-3">
                  <span className="text-lg">⭐</span>
                </div>
                
                {/* Angel Wing Icon */}
                <div className="absolute top-3 left-3">
                  <span className="text-lg">👼</span>
                </div>
                
                <CardHeader className="pb-3 pt-12">
                  <CardTitle className="text-sm flex items-center gap-2 bg-gradient-to-r from-green-600 via-blue-500 to-amber-500 bg-clip-text text-transparent font-bold">
                    <span className="text-sm">📥</span>
                    Special Message from Heaven
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm whitespace-pre-wrap bg-white/90 p-4 rounded-lg border border-green-200 shadow-inner">
                    <div className="bg-gradient-to-r from-green-700 via-blue-600 to-amber-600 bg-clip-text text-transparent font-medium italic">
                      {generateHeavenlyResponse(index)}
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-xs bg-gradient-to-r from-green-500 via-blue-500 to-amber-500 bg-clip-text text-transparent font-medium italic">
                      💫 With eternal love from Chaya Sara Leah Bas Uri zt"l 💫
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ))}
      
      {/* Flying Doves Around the Page */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Dove 1 - Flying across top using regular dove (not olive branch) */}
        <img
          src="/dove_no_background.png"
          alt=""
          className="absolute w-14 h-12 opacity-70 drop-shadow-lg"
          style={{
            left: '5%',
            top: '8%',
            animation: 'flyAcrossTop 20s linear infinite, gentle-bob 3s ease-in-out infinite',
            filter: 'brightness(1.2) contrast(1.1)'
          }}
        />
        
        {/* Dove 2 - Circular flight using flying doves group */}
        <img
          src="/flying _doves .png"
          alt=""
          className="absolute w-16 h-12 opacity-60 drop-shadow-lg"
          style={{
            left: '80%',
            top: '15%',
            animation: 'flyCircular 25s linear infinite, wing-sway 2.5s ease-in-out infinite',
            filter: 'brightness(1.2) contrast(1.1)'
          }}
        />
        
        {/* Dove 3 - Diagonal flight using no background dove */}
        <img
          src="/dove_no_background.png"
          alt=""
          className="absolute w-13 h-11 opacity-65 drop-shadow-lg"
          style={{
            left: '15%',
            top: '60%',
            animation: 'flyDiagonal 30s linear infinite, flutter-wings 2s ease-in-out infinite',
            filter: 'brightness(1.2) contrast(1.1)'
          }}
        />
      </div>
      
      {/* CSS Animations for Dove with Olive Branch */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes dove-swoop {
            0% { 
              transform: translateX(0px) translateY(-50px) rotate(-25deg) scale(0.6); 
              opacity: 0.8;
            }
            15% { 
              transform: translateX(-100px) translateY(50px) rotate(-20deg) scale(0.8); 
              opacity: 0.9;
            }
            35% { 
              transform: translateX(-250px) translateY(150px) rotate(-10deg) scale(1); 
              opacity: 1;
            }
            55% { 
              transform: translateX(-400px) translateY(220px) rotate(0deg) scale(1.1); 
              opacity: 1;
            }
            70% { 
              transform: translateX(-450px) translateY(250px) rotate(5deg) scale(1.05); 
              opacity: 1;
            }
            75% { 
              transform: translateX(-460px) translateY(260px) rotate(3deg) scale(1); 
              opacity: 1;
            }
            85% { 
              transform: translateX(-550px) translateY(200px) rotate(-15deg) scale(0.9); 
              opacity: 0.8;
            }
            95% { 
              transform: translateX(-650px) translateY(100px) rotate(-25deg) scale(0.7); 
              opacity: 0.5;
            }
            100% { 
              transform: translateX(-750px) translateY(-50px) rotate(-30deg) scale(0.5); 
              opacity: 0;
            }
          }
          
          @keyframes wing-flutter {
            0% { transform: scaleY(1) scaleX(1); }
            25% { transform: scaleY(0.9) scaleX(1.1); }
            50% { transform: scaleY(0.85) scaleX(1.15); }
            75% { transform: scaleY(0.9) scaleX(1.1); }
            100% { transform: scaleY(1) scaleX(1); }
          }
          
          @keyframes letter-drop {
            0% { 
              transform: translateX(0px) translateY(0px) rotate(0deg); 
              opacity: 1;
            }
            74% { 
              transform: translateX(0px) translateY(0px) rotate(0deg); 
              opacity: 1;
            }
            75% { 
              transform: translateX(0px) translateY(0px) rotate(5deg); 
              opacity: 1;
            }
            80% { 
              transform: translateX(-10px) translateY(40px) rotate(15deg); 
              opacity: 0.9;
            }
            85% { 
              transform: translateX(-20px) translateY(80px) rotate(25deg); 
              opacity: 0.8;
            }
            90% { 
              transform: translateX(-30px) translateY(120px) rotate(35deg); 
              opacity: 0.6;
            }
            95% { 
              transform: translateX(-40px) translateY(160px) rotate(45deg); 
              opacity: 0.3;
            }
            100% { 
              transform: translateX(-50px) translateY(200px) rotate(60deg); 
              opacity: 0;
            }
          }
          
          /* Flying Doves Around Page Animations */
          @keyframes flyAcrossTop {
            0% { left: -10%; transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-15px) rotate(5deg); }
            50% { transform: translateY(8px) rotate(-3deg); }
            75% { transform: translateY(-10px) rotate(2deg); }
            100% { left: 110%; transform: translateY(0px) rotate(0deg); }
          }
          
          @keyframes flyCircular {
            0% { transform: rotate(0deg) translateX(80px) rotate(0deg) translateY(0px); }
            25% { transform: rotate(90deg) translateX(80px) rotate(-90deg) translateY(-12px); }
            50% { transform: rotate(180deg) translateX(80px) rotate(-180deg) translateY(8px); }
            75% { transform: rotate(270deg) translateX(80px) rotate(-270deg) translateY(-8px); }
            100% { transform: rotate(360deg) translateX(80px) rotate(-360deg) translateY(0px); }
          }
          
          @keyframes flyDiagonal {
            0% { left: 15%; top: 60%; transform: rotate(0deg) scale(1); }
            20% { left: 35%; top: 45%; transform: rotate(-15deg) scale(1.1); }
            40% { left: 55%; top: 70%; transform: rotate(10deg) scale(0.9); }
            60% { left: 75%; top: 35%; transform: rotate(-8deg) scale(1.05); }
            80% { left: 25%; top: 80%; transform: rotate(5deg) scale(0.95); }
            100% { left: 15%; top: 60%; transform: rotate(0deg) scale(1); }
          }
          
          @keyframes gentle-bob {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-8px) rotate(2deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
          }
          
          @keyframes wing-sway {
            0%, 100% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.08) rotate(3deg); }
            50% { transform: scale(0.95) rotate(-2deg); }
            75% { transform: scale(1.05) rotate(1deg); }
          }
          
          @keyframes flutter-wings {
            0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
            25% { transform: translateY(-12px) scale(1.1) rotate(-5deg); }
            50% { transform: translateY(4px) scale(0.9) rotate(3deg); }
            75% { transform: translateY(-8px) scale(1.05) rotate(-2deg); }
          }
        `
      }} />
    </div>
  );
}
