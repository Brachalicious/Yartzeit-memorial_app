import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Heart, Send, BookOpen, PenTool } from 'lucide-react';
import { useLetters } from '@/hooks/useLetters';
import { LettersList } from '@/components/letters/LettersList';

export function LettersPage() {
  const [letter, setLetter] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [showDove, setShowDove] = React.useState(false);
  const [userName, setUserName] = React.useState('');
  const [selectedMailbox, setSelectedMailbox] = React.useState<'chaya' | 'user' | 'idf' | null>(null);
  const [showUserNameInput, setShowUserNameInput] = React.useState(false);
  const [idfLetter, setIdfLetter] = React.useState('');
  const [sendingIdf, setSendingIdf] = React.useState(false);
  const [showMailFlying, setShowMailFlying] = React.useState(false);
  const [selectedMailboxPosition, setSelectedMailboxPosition] = React.useState<{x: number, y: number} | null>(null);
  const [activeTab, setActiveTab] = React.useState<'letters' | 'learning'>('letters');
  const [learningContent, setLearningContent] = React.useState('');
  const [learningTitle, setLearningTitle] = React.useState('');
  const [learningNotes, setLearningNotes] = React.useState('');
  const [letterCount, setLetterCount] = React.useState(0); // Track letters sent to Chaya Sara Leah
  const { letters, loading, error, createLetter, deleteLetter } = useLetters();

  // Load user name from localStorage on component mount
  React.useEffect(() => {
    const savedUserName = localStorage.getItem('userLettersName');
    if (savedUserName) {
      setUserName(savedUserName);
    }
    
    // Load letter count for return letter tracking
    const savedLetterCount = localStorage.getItem('chayaLetterCount');
    if (savedLetterCount) {
      setLetterCount(parseInt(savedLetterCount, 10) || 0);
    }
  }, []);

  // Save user name to localStorage whenever it changes
  React.useEffect(() => {
    if (userName.trim()) {
      localStorage.setItem('userLettersName', userName.trim());
      setShowUserNameInput(false);
    }
  }, [userName]);

  // Save letter count whenever it changes
  React.useEffect(() => {
    localStorage.setItem('chayaLetterCount', letterCount.toString());
  }, [letterCount]);

  const handleUserMailboxClick = () => {
    if (!userName.trim()) {
      setShowUserNameInput(true);
    } else {
      if (selectedMailbox === 'user') {
        setSelectedMailbox(null);
        setShowMailFlying(false);
      } else {
        setSelectedMailbox('user');
        // Calculate responsive position
        const screenWidth = window.innerWidth;
        const responsivePosition = {
          x: screenWidth < 768 ? screenWidth / 2 - 60 : window.innerWidth - 200, // Center on mobile, right side on desktop
          y: screenWidth < 768 ? 400 : 200 // Adjust for mobile
        };
        setSelectedMailboxPosition(responsivePosition);
        setShowMailFlying(true);
      }
    }
  };

  const handleMailboxClick = (mailboxType: 'chaya' | 'idf' | 'user', position: {x: number, y: number}) => {
    if (selectedMailbox === mailboxType) {
      setSelectedMailbox(null);
      setShowMailFlying(false);
    } else {
      setSelectedMailbox(mailboxType);
      // Calculate responsive position based on screen size
      const screenWidth = window.innerWidth;
      const responsivePosition = {
        x: screenWidth < 768 ? screenWidth / 2 - 60 : position.x, // Center on mobile
        y: screenWidth < 768 ? position.y - 50 : position.y // Adjust for mobile
      };
      setSelectedMailboxPosition(responsivePosition);
      setShowMailFlying(true);
    }
  };

  const handleSend = async () => {
    if (!letter.trim()) return;
    
    setSending(true);
    setShowDove(true);
    
    try {
      // Show dove animation for 4 seconds
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Save the letter with mailbox information
      await createLetter({ 
        content: letter,
        mailbox: selectedMailbox === 'user' ? 'user' : 'chaya',
        recipient: selectedMailbox === 'user' ? userName : 'Chaya Sara Leah Bas Uri zt"l'
      });

      // If writing to Chaya Sara Leah, increment counter and check for return letter
      if (selectedMailbox === 'chaya') {
        const newCount = letterCount + 1;
        setLetterCount(newCount);
        
        // Send return letter every 3rd letter to Chaya Sara Leah
        if (newCount % 3 === 0) {
          const responses = [
            "My precious child, I feel your love and it brings such light to my soul. Your words reached me here in this beautiful place, and I want you to know that I am always watching over you with such pride. Keep sharing your heart - it makes heaven brighter. 💙✨",
            "I see you, my beloved, and every letter you send fills my heart with joy! You are stronger than you know, and I am so proud of the beautiful person you are. I'm saving all your letters in my special heavenly box. Send me more! 🌟💕",
            "Your letter made all the angels smile! I read it with such happiness, and I want you to know that I am never far from you. Keep writing to me - your words are like golden threads connecting earth to heaven. I love you so much! 👼✨",
            "Dearest soul, your words touch the very depths of heaven. I want you to know that every prayer, every memory you share lifts my neshomah higher. You are never alone - I am always with you, guiding you with love from above. 🌟💕",
            "My beloved, the angels told me you wrote again! Your letters are like beautiful flowers in the garden of heaven. I treasure each word and hold them close to my heart. Keep writing - your love makes my soul dance with joy! 👼✨",
            "Sweet child, I received your beautiful letter and it made all of heaven glow brighter. Know that every tear you shed, every smile you share, every moment you remember me brings us closer together across the worlds. I love you eternally! 💙🕊️"
          ];
          
          // Generate a return letter and save it to user's mailbox after dove animation
          setTimeout(async () => {
            const responseIndex = Math.floor(Math.random() * responses.length);
            await createLetter({
              content: responses[responseIndex],
              mailbox: 'user',
              recipient: userName || 'Beloved Friend',
              sender: 'Chaya Sara Leah Bas Uri zt"l'
            });
            
            // Show a special notification about the return letter
            setTimeout(() => {
              alert('🕊️ A beautiful dove has brought you a return letter from heaven! Check your mailbox to read Chaya Sara Leah\'s response. ✨');
            }, 1000);
          }, 3000); // Delay to let dove animation finish
        }
      }
      
      // Clear the form
      setLetter('');
    } catch (error) {
      console.error('Error sending letter:', error);
    } finally {
      setSending(false);
      setShowDove(false);
    }
  };

  const handleSendIdf = async () => {
    if (!idfLetter.trim()) return;
    
    setSendingIdf(true);
    setShowDove(true);
    
    try {
      // Open FIDF link immediately for real-time sending
      window.open('https://www.fidf.org/write-to-a-soldier/', '_blank');
      
      // Show dove animation for 4 seconds
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Save a copy to IDF mailbox
      await createLetter({ 
        content: `💙 Letter sent to IDF soldiers in memory of Chaya Sara Leah Bas Uri zt"l:\n\n${idfLetter}\n\n🇮🇱 Sent via FIDF.org - Friends of the Israel Defense Forces`,
        mailbox: 'idf',
        recipient: 'IDF Soldiers'
      });
      
      // Show success message
      alert('🇮🇱 Your letter has been opened on FIDF.org for real-time sending to soldiers, and a copy has been saved in the IDF mailbox! Thank you for spreading love in Chaya Sara Leah\'s memory.');
      
      // Clear the form
      setIdfLetter('');
    } catch (error) {
      console.error('Error saving IDF letter copy:', error);
      alert('Your letter was opened on FIDF.org successfully! There was an issue saving a copy locally, but your letter to the soldiers is ready to send.');
    } finally {
      setSendingIdf(false);
      setShowDove(false);
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
          <Heart className="h-8 w-8 text-amber-500" />
          <span className="bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent">
            Send a Letter to Chaya Sara Leah Bas Uri זצ״ל's Mailbox in Heaven
          </span>
        </h2>
        <p className="mt-2 bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent font-semibold">
          Choose a mailbox to write and view letters
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-6">
        <Button
          variant={activeTab === 'letters' ? 'default' : 'outline'}
          onClick={() => setActiveTab('letters')}
          className={`flex items-center gap-2 px-4 md:px-6 py-2 transition-all duration-300 ${
            activeTab === 'letters' 
              ? 'bg-gradient-to-r from-blue-600 to-amber-600 text-white' 
              : 'border-blue-300 text-blue-600 hover:bg-blue-50'
          }`}
        >
          <Send className="h-4 w-4" />
          Letters & Mailboxes
        </Button>
        <Button
          variant={activeTab === 'learning' ? 'default' : 'outline'}
          onClick={() => setActiveTab('learning')}
          className={`flex items-center gap-2 px-4 md:px-6 py-2 transition-all duration-300 ${
            activeTab === 'learning' 
              ? 'bg-gradient-to-r from-blue-600 to-amber-600 text-white' 
              : 'border-blue-300 text-blue-600 hover:bg-blue-50'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Learning Record
        </Button>
      </div>

      {activeTab === 'letters' && (
      <div>
      {/* Mailboxes Layout */}
      <div className="relative min-h-[850px] rounded-lg p-4 md:p-8">
        {/* Floating clouds - responsive */}
        <div className="absolute top-8 md:top-12 left-1/4 w-12 h-6 md:w-16 md:h-8 bg-white/60 rounded-full animate-pulse"></div>
        <div className="absolute top-6 md:top-8 right-1/4 w-16 h-8 md:w-20 md:h-10 bg-white/50 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-12 md:top-16 left-1/2 w-10 h-5 md:w-12 md:h-6 bg-white/70 rounded-full animate-pulse delay-500"></div>

        {/* Vertical Mailbox Layout - enhanced spacing */}
        <div className="flex flex-col items-center space-y-16 md:space-y-20 pt-6 md:pt-8">
          
          {/* Chaya Sara Leah's Mailbox */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 w-full max-w-4xl">
            <div className="relative">
              <div 
                className={`relative cursor-pointer transition-all duration-500 ease-out hover:scale-105 ${
                  selectedMailbox === 'chaya' ? 'scale-110 z-20 shadow-2xl' : 'hover:z-10 hover:shadow-xl'
                }`}
                onClick={() => handleMailboxClick('chaya', {x: 300, y: 150})}
              >
                {/* Chaya Sara Leah's Mailbox Image */}
                <div className="relative w-32 h-24 md:w-36 md:h-28">
                  <img 
                    src="/chaya_sara_leahs_mailbox.png" 
                    alt="Chaya Sara Leah's Mailbox" 
                    className="w-full h-full object-contain rounded-lg shadow-xl transition-all duration-300"
                  />
                  
                  {/* Address Overlay */}
                  <div className="absolute top-1 left-1 right-1 text-center">
                    <p className="text-xs font-bold text-amber-600 bg-white/90 rounded px-1 py-0.5 shadow-sm">
                      30 Heavens Lane
                    </p>
                  </div>

                  {/* Glowing effect when selected */}
                  {selectedMailbox === 'chaya' && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400/30 to-blue-400/30 animate-pulse"></div>
                  )}
                </div>
                
                {/* Click instruction moved further up */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-center w-44">
                  <p className="text-xs text-gray-600">Click to open and see mail fly out!</p>
                </div>
              </div>
              
              {/* Label - moved below mailbox */}
              <div className="mt-4 text-center w-full">
                <p className="text-sm font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  Chaya Sara Leah's Mailbox
                </p>
              </div>
            </div>
            
            {/* Send Mail Button */}
            <Button
              onClick={() => setSelectedMailbox('chaya')}
              className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white px-4 md:px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 w-full md:w-auto"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Mail to Chaya Sara Leah Bas Uri zt"l
            </Button>
          </div>

          {/* IDF Soldiers Mailbox */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 w-full max-w-4xl">
            <div className="relative">
              <div 
                className={`relative cursor-pointer transition-all duration-500 ease-out hover:scale-105 ${
                  selectedMailbox === 'idf' ? 'scale-110 z-20 shadow-2xl' : 'hover:z-10 hover:shadow-xl'
                }`}
                onClick={() => handleMailboxClick('idf', {x: 300, y: 350})}
              >
                {/* IDF Mailbox Image */}
                <div className="relative w-32 h-24 md:w-36 md:h-28">
                  <img 
                    src="/idf_mailbox.png" 
                    alt="IDF Soldiers Mailbox" 
                    className="w-full h-full object-contain rounded-lg shadow-xl transition-all duration-300"
                  />
                  
                  {/* IDF Text Overlay - moved up higher */}
                  <div className="absolute -top-2 left-1 right-1 text-center">
                    <p className="text-xs font-bold text-yellow-600 bg-white/90 rounded px-1 py-0.5 shadow-sm">
                      Letters to IDF
                    </p>
                  </div>

                  {/* Glowing effect when selected */}
                  {selectedMailbox === 'idf' && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-400/30 to-blue-400/30 animate-pulse"></div>
                  )}
                </div>
              </div>
              
              {/* Label - moved below mailbox */}
              <div className="mt-4 text-center w-full">
                <p className="text-sm font-bold bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-600 bg-clip-text text-transparent">
                  IDF Mailbox
                </p>
                <p className="text-xs text-gray-600 mt-1">Support our brave soldiers!</p>
              </div>
            </div>
            
            {/* Send Mail Button */}
            <Button
              onClick={() => {
                // Open FIDF link in new tab for real-time sending
                window.open('https://www.fidf.org/write-to-a-soldier/', '_blank');
                // Show success message
                setTimeout(() => {
                  alert('🇮🇱 FIDF website opened! You can now send real-time letters to IDF soldiers. Use the form below to also save a copy in your local mailbox.');
                }, 1000);
                // Also allow local saving
                setSelectedMailbox('idf');
              }}
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-4 md:px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 w-full md:w-auto"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Letters to IDF Soldiers (Real-Time)
            </Button>
          </div>

          {/* User's Mailbox */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 w-full max-w-4xl">
            <div className="relative">
              {/* Letters Back to You Text - moved down slightly */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-sm font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 bg-clip-text text-transparent">
                  Letters Back to You
                </p>
              </div>
              
              <div 
                className={`relative cursor-pointer transition-all duration-500 ease-out hover:scale-105 ${
                  selectedMailbox === 'user' ? 'scale-110 z-20 shadow-2xl' : 'hover:z-10 hover:shadow-xl'
                }`}
                onClick={handleUserMailboxClick}
              >
                {/* User's Mailbox Image */}
                <div className="relative w-32 h-24 md:w-36 md:h-28">
                  <img 
                    src="/users_mailbox.png" 
                    alt="User's Mailbox" 
                    className="w-full h-full object-contain rounded-lg shadow-xl transition-all duration-300"
                  />

                  {/* Customizable Address Overlay */}
                  {userName && (
                    <div className="absolute top-1 left-1 right-1 text-center">
                      <p className="text-xs font-bold text-blue-600 bg-white/90 rounded px-1 py-0.5 shadow-sm truncate">
                        {userName}'s Place
                      </p>
                    </div>
                  )}

                  {/* Glowing effect when selected */}
                  {selectedMailbox === 'user' && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/30 to-blue-500/30 animate-pulse"></div>
                  )}
                </div>
                
                {/* Label - moved below mailbox */}
                <div className="mt-4 text-center w-full">
                  <p className="text-sm font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 bg-clip-text text-transparent">
                    {userName ? `${userName}'s Mailbox` : 'Your Mailbox'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Personal letters & responses</p>
                </div>
              </div>
            </div>
            
            {/* Send Mail Button and Customize Options */}
            <div className="flex flex-col space-y-2 w-full md:w-auto">
              <Button
                onClick={() => setSelectedMailbox('user')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 md:px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 w-full md:w-auto"
              >
                <Send className="mr-2 h-4 w-4" />
                Letters to Self & From Chaya Sara Leah
              </Button>
              
              <Button
                onClick={() => setShowUserNameInput(true)}
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50 px-4 md:px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-md w-full md:w-auto"
              >
                📝 Customize Name & Address
              </Button>
            </div>
          </div>
        </div>

        {/* User Name Input Modal */}
        {showUserNameInput && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 rounded-lg p-4">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-center bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent">
                  Customize Your Mailbox
                </CardTitle>
                <p className="text-center text-gray-600 text-sm">
                  Personalize your mailbox with your name for a special touch
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mailboxName" className="text-sm font-medium text-gray-700">
                      Your Name
                    </Label>
                    <input
                      id="mailboxName"
                      type="text"
                      placeholder="Enter your name (e.g., Sarah, David, etc.)"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md text-center focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      autoFocus
                      maxLength={30}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && userName.trim()) {
                          setShowUserNameInput(false);
                        }
                        if (e.key === 'Escape') {
                          setShowUserNameInput(false);
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      This will appear on your mailbox as "{userName || 'Your Name'}'s Place"
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowUserNameInput(false)}
                      variant="outline"
                      className="flex-1 transition-all duration-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => setShowUserNameInput(false)}
                      disabled={!userName.trim()}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                    >
                      ✨ Save Name
                    </Button>
                  </div>
                  
                  {userName.trim() && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">
                        Preview: <span className="font-semibold">"{userName}'s Place"</span> will appear on your mailbox
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instruction text - responsive */}
        {!selectedMailbox && (
          <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 text-center px-4">
            <p className="text-xs md:text-sm text-gray-700 bg-white/95 px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg border border-gray-200 backdrop-blur-sm">
              <span className="hidden md:inline">Click on a mailbox to see letters fly out • Click again to put letters back • Use buttons to send new mail</span>
              <span className="md:hidden">Tap mailboxes to see letters • Use buttons to send mail</span>
            </p>
          </div>
        )}

        {/* Flying Mail Animation - Enhanced */}
        {showMailFlying && selectedMailboxPosition && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {letters.filter(letter => letter.mailbox === selectedMailbox).slice(0, 8).map((letter, index) => (
              <div
                key={letter.id}
                className="absolute transition-all duration-1500 ease-out"
                style={{
                  left: `${selectedMailboxPosition.x}px`,
                  top: `${selectedMailboxPosition.y}px`,
                  transform: showMailFlying 
                    ? `translate(${(index % 4) * 60 - 120}px, ${Math.floor(index / 4) * 80 - 60}px) rotate(${(index % 2) * 10 - 5}deg)`
                    : 'translate(0, 0) rotate(0deg)',
                  opacity: showMailFlying ? 1 : 0,
                  animation: `mailFlyOut 1.5s ease-out ${index * 0.15}s forwards`,
                  zIndex: 25 - index
                }}
              >
                <div className={`p-2 rounded-lg shadow-xl border-2 w-20 h-14 flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 ${
                  selectedMailbox === 'chaya' ? 'border-amber-300 bg-gradient-to-br from-amber-50/90 to-amber-100/90' :
                  selectedMailbox === 'user' ? 'border-blue-300 bg-gradient-to-br from-blue-50/90 to-blue-100/90' :
                  'border-yellow-300 bg-gradient-to-br from-yellow-50/90 to-yellow-100/90'
                }`}>
                  <span className="text-lg">✉️</span>
                  <div className={`w-8 h-px mt-1 ${
                    selectedMailbox === 'chaya' ? 'bg-amber-400' :
                    selectedMailbox === 'user' ? 'bg-blue-400' :
                    'bg-yellow-400'
                  }`}></div>
                </div>
              </div>
            ))}
            
            {/* Additional sparkle effects for mail flying */}
            {showMailFlying && [...Array(6)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute animate-ping"
                style={{
                  left: `${selectedMailboxPosition.x + (i % 3) * 40 - 60}px`,
                  top: `${selectedMailboxPosition.y + Math.floor(i / 3) * 30 - 30}px`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s'
                }}
              >
                <span className={`text-lg ${
                  selectedMailbox === 'chaya' ? 'text-amber-400' :
                  selectedMailbox === 'user' ? 'text-blue-400' :
                  'text-yellow-400'
                }`}>✨</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Mail Flying Animation CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes mailFlyOut {
            0% { 
              transform: translate(0, 0) scale(0.3) rotate(0deg); 
              opacity: 0; 
            }
            20% { 
              transform: translate(10px, -10px) scale(0.6) rotate(5deg); 
              opacity: 0.7; 
            }
            60% { 
              transform: translate(var(--mid-x, 30px), var(--mid-y, -30px)) scale(1) rotate(var(--mid-rotation, 10deg)); 
              opacity: 1; 
            }
            100% { 
              transform: translate(var(--final-x, 0), var(--final-y, 0)) scale(1) rotate(var(--final-rotation, 0deg)); 
              opacity: 1; 
            }
          }
          
          @keyframes mailFlyIn {
            0% { 
              transform: translate(var(--final-x, 0), var(--final-y, 0)) scale(1) rotate(var(--final-rotation, 0deg)); 
              opacity: 1; 
            }
            100% { 
              transform: translate(0, 0) scale(0.3) rotate(0deg); 
              opacity: 0; 
            }
          }
        `
      }} />

      {/* Letters Content - Only show when mailbox is selected */}
      {selectedMailbox && (
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 px-4">
          {/* Back Button and Sharing - responsive */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Button 
              onClick={() => {
                setSelectedMailbox(null);
                setShowMailFlying(false);
              }}
              variant="outline"
              className="transition-all duration-300 hover:bg-gray-50 hover:shadow-md order-1 md:order-1"
            >
              ← Close Mailbox
            </Button>
            
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  const mailboxName = selectedMailbox === 'chaya' ? 'Chaya Sara Leah\'s Mailbox' : 
                                    selectedMailbox === 'user' ? `${userName || 'Your'} Mailbox` : 'IDF Mailbox';
                  const mailboxLetters = letters.filter(letter => letter.mailbox === selectedMailbox);
                  const shareData = {
                    mailbox: mailboxName,
                    totalLetters: mailboxLetters.length,
                    recentLetters: mailboxLetters.slice(-3).map(letter => ({
                      content: letter.content.substring(0, 100) + (letter.content.length > 100 ? '...' : ''),
                      date: new Date(letter.created_at).toLocaleDateString()
                    }))
                  };
                  
                  if (navigator.share) {
                    navigator.share({
                      title: `Letters from ${mailboxName}`,
                      text: `View ${mailboxLetters.length} letters in memory of Chaya Sara Leah Bas Uri zt"l`,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(JSON.stringify(shareData, null, 2));
                    alert('📋 Mailbox content copied to clipboard! Share this with others to spread love and remembrance.');
                  }
                }}
                variant="outline"
                className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 transition-all duration-300 hover:shadow-md"
              >
                📤 Share Letters
              </Button>
              
              <Button
                onClick={() => {
                  const inviteText = `💙 I'd like to invite you to write letters in memory of Chaya Sara Leah Bas Uri zt"l, a beautiful soul who brought light to the world. 
                  
Join me in sending love to heaven and supporting our brave IDF soldiers in her memory: ${window.location.href}

Your words of love, support, and remembrance make a difference. 🕊️✨`;
                  
                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(inviteText)}`;
                  const emailUrl = `mailto:?subject=${encodeURIComponent('Memorial Letters for Chaya Sara Leah Bas Uri zt"l')}&body=${encodeURIComponent(inviteText)}`;
                  
                  // Create a menu for sharing options
                  const shareMenu = document.createElement('div');
                  shareMenu.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    z-index: 1000;
                    min-width: 300px;
                  `;
                  
                  shareMenu.innerHTML = `
                    <h3 style="margin: 0 0 15px 0; font-weight: bold; color: #1e40af;">Share Invitation</h3>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                      <button onclick="window.open('${whatsappUrl}', '_blank'); document.body.removeChild(document.querySelector('[data-share-menu]'))" 
                              style="background: #25d366; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                        📱 Share via WhatsApp
                      </button>
                      <button onclick="window.open('${emailUrl}', '_blank'); document.body.removeChild(document.querySelector('[data-share-menu]'))" 
                              style="background: #ea4335; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                        📧 Share via Email
                      </button>
                      <button onclick="navigator.clipboard.writeText('${inviteText.replace(/'/g, "\\'")}'); alert('💌 Beautiful invitation copied to clipboard!'); document.body.removeChild(document.querySelector('[data-share-menu]'))" 
                              style="background: #6366f1; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                        📋 Copy to Clipboard
                      </button>
                      <button onclick="document.body.removeChild(document.querySelector('[data-share-menu]'))" 
                              style="background: #6b7280; color: white; border: none; padding: 8px; border-radius: 8px; cursor: pointer;">
                        Cancel
                      </button>
                    </div>
                  `;
                  
                  shareMenu.setAttribute('data-share-menu', 'true');
                  document.body.appendChild(shareMenu);
                  
                  // Add backdrop
                  const backdrop = document.createElement('div');
                  backdrop.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                  `;
                  backdrop.onclick = () => {
                    document.body.removeChild(shareMenu);
                    document.body.removeChild(backdrop);
                  };
                  document.body.appendChild(backdrop);
                }}
                variant="outline"
                className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 transition-all duration-300 hover:shadow-md"
              >
                👥 Invite Others (WhatsApp/Email)
              </Button>
              
              {selectedMailbox === 'chaya' && (
                <Button
                  onClick={() => {
                    const prayerText = `🕯️ In loving memory of Chaya Sara Leah Bas Uri zt"l 🕯️
                    
"May her neshomah have an aliyah and may her memory be a blessing to all who knew her. Her light continues to shine in the hearts of those she touched."

זכרונה לברכה - May her memory be a blessing`;
                    
                    if (navigator.share) {
                      navigator.share({
                        title: 'Prayer for Chaya Sara Leah Bas Uri zt"l',
                        text: prayerText
                      });
                    } else {
                      navigator.clipboard.writeText(prayerText);
                      alert('🤲 Prayer copied to clipboard. Share this blessing with others.');
                    }
                  }}
                  variant="outline"
                  className="bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 transition-all duration-300 hover:shadow-md"
                >
                  🤲 Share Prayer
                </Button>
              )}
            </div>
          </div>

          {/* Letter Writing Form - Enhanced */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-4">
              <CardTitle className={`font-bold text-center text-lg md:text-xl ${
                selectedMailbox === 'chaya' 
                  ? 'bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent'
                  : selectedMailbox === 'user'
                  ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 bg-clip-text text-transparent'
              }`}>
                {selectedMailbox === 'chaya' && '✍️ Write to Chaya Sara Leah'}
                {selectedMailbox === 'user' && `📝 Write to Your Mailbox`}
                {selectedMailbox === 'idf' && '🇮🇱 Write to IDF - Spread Love in Her Name'}
              </CardTitle>
              
              {/* Clear Destination Messaging */}
              <div className="text-center mt-2 mb-2">
                {selectedMailbox === 'chaya' && (
                  <p className="text-sm font-semibold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
                    📮 Sending to Heaven for Chaya Sara Leah Bas Uri zt"l
                  </p>
                )}
                {selectedMailbox === 'user' && (
                  <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 bg-clip-text text-transparent">
                    📮 Sending to Self for Personal Reflection
                  </p>
                )}
                {selectedMailbox === 'idf' && (
                  <p className="text-sm font-semibold bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-600 bg-clip-text text-transparent">
                    📮 Sending to Soldiers for IDF Support
                  </p>
                )}
              </div>
              
              <p className={`text-center font-medium text-sm md:text-base ${
                selectedMailbox === 'chaya' 
                  ? 'bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent'
                  : selectedMailbox === 'user'
                  ? 'bg-gradient-to-r from-blue-700 via-blue-800 to-blue-700 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 bg-clip-text text-transparent'
              }`}>
                {selectedMailbox === 'chaya' && 'Send your thoughts, memories, and prayers directly to her neshomah'}
                {selectedMailbox === 'user' && 'Write personal notes and messages'}
                {selectedMailbox === 'idf' && 'Send encouragement and support to our brave soldiers in memory of Chaya Sara Leah'}
              </p>
              {selectedMailbox === 'idf' && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  Learn more about supporting IDF soldiers at{' '}
                  <a 
                    href="https://www.fidf.org/write-to-a-soldier/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    FIDF.org
                  </a>
                </p>
              )}
              {selectedMailbox === 'chaya' && (
                <p className="text-center text-sm text-gray-600 mt-2 italic">
                  💫 Letters to Chaya Sara Leah may receive heavenly responses that will appear in your personal mailbox
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="letter" className={`font-semibold text-lg ${
                  selectedMailbox === 'chaya' 
                    ? 'bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent'
                    : selectedMailbox === 'user'
                    ? 'bg-gradient-to-r from-blue-700 via-blue-800 to-blue-700 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 bg-clip-text text-transparent'
                }`}>
                  {selectedMailbox === 'chaya' && 'Dear Chaya Sara Leah,'}
                  {selectedMailbox === 'user' && `Dear ${userName || 'Friend'},`}
                  {selectedMailbox === 'idf' && 'Dear Brave Soldiers of Tzahal,'}
                </Label>
                <div className="relative">
                  <Textarea
                    id="letter"
                    placeholder={
                      selectedMailbox === 'chaya' 
                        ? "Share your thoughts, memories, prayers, or just say hello..."
                        : selectedMailbox === 'user'
                        ? "Write a personal note to yourself..."
                        : "Share words of encouragement, gratitude, and support for our heroes..."
                    }
                    value={selectedMailbox === 'idf' ? idfLetter : letter}
                    onChange={(e) => {
                      if (selectedMailbox === 'idf') {
                        setIdfLetter(e.target.value);
                      } else {
                        setLetter(e.target.value);
                      }
                    }}
                    rows={6}
                    className="resize-none relative z-10 bg-transparent border border-gray-300 rounded-md p-3"
                    style={{ 
                      color: 'transparent',
                      caretColor: selectedMailbox === 'chaya' ? '#2563eb' : selectedMailbox === 'user' ? '#1e40af' : '#ca8a04'
                    }}
                  />
                  <div 
                    className="absolute inset-0 p-3 pointer-events-none overflow-hidden whitespace-pre-wrap break-words rounded-md font-mono"
                    style={{
                      fontSize: 'inherit',
                      lineHeight: 'inherit',
                      color: selectedMailbox === 'chaya' ? '#1e40af' : selectedMailbox === 'user' ? '#1e3a8a' : '#ca8a04',
                      background: selectedMailbox === 'chaya' 
                        ? 'linear-gradient(135deg, #dbeafe 0%, #fef3c7 50%, #dbeafe 100%)'
                        : selectedMailbox === 'user'
                        ? 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 50%, #dbeafe 100%)'
                        : 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 50%, #fef3c7 100%)'
                    }}
                  >
                    {selectedMailbox === 'idf' ? idfLetter : letter}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <Button
                  onClick={selectedMailbox === 'idf' ? handleSendIdf : handleSend}
                  disabled={
                    selectedMailbox === 'idf' 
                      ? (!idfLetter.trim() || sendingIdf)
                      : (!letter.trim() || sending)
                  }
                  className={`w-full md:w-auto px-6 py-3 text-sm md:text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    selectedMailbox === 'chaya'
                      ? "bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white"
                      : selectedMailbox === 'user'
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                      : "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white"
                  }`}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {selectedMailbox === 'chaya' && (sending ? 'Sending to Heaven...' : 'Send Letter 🕊️')}
                  {selectedMailbox === 'user' && (sending ? 'Saving...' : 'Save Note 📝')}
                  {selectedMailbox === 'idf' && (sendingIdf ? 'Sending Love...' : 'Send Letter to Soldiers 🇮🇱')}
                </Button>
                
                <div className="text-xs md:text-sm text-gray-600 text-center md:text-right max-w-xs">
                  {selectedMailbox === 'chaya' && '💫 Letters stored in her heavenly mailbox, responses may appear in yours'}
                  {selectedMailbox === 'user' && '📋 Saved to your personal mailbox for private reflection'}
                  {selectedMailbox === 'idf' && '🇮🇱 Spreading love in Chaya Sara Leah\'s memory to our heroes'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Letters List - Enhanced filtering for user mailbox */}
          <LettersList 
            letters={
              selectedMailbox === 'user' 
                ? letters.filter(letter => 
                    letter.mailbox === 'user' || 
                    (letter.recipient && letter.recipient.includes(userName || 'Friend'))
                  )
                : letters.filter(letter => letter.mailbox === selectedMailbox)
            } 
            onDelete={deleteLetter} 
          />
        </div>
      )}

      {/* Dove Animation */}
      {showDove && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Dynamic Sending Text */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="animate-pulse">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent text-center drop-shadow-lg">
                {selectedMailbox === 'chaya' && '✨ Sending to Heaven for Chaya Sara Leah Bas Uri zt"l... ✨'}
                {selectedMailbox === 'user' && '✨ Saving to Your Mailbox... ✨'}
                {selectedMailbox === 'idf' && '✨ Sending Love to IDF Soldiers... ✨'}
              </h2>
            </div>
          </div>

          {/* Dove Animation */}
          <div className="absolute inset-0">
            <div className="relative w-full h-full">
              {/* Dove with Image */}
              <div 
                className="absolute transform transition-all duration-4000 ease-in-out"
                style={{
                  animation: 'dove-flight 4s ease-in-out forwards',
                  left: '-100px',
                  top: '60%',
                }}
              >
                <div className="relative">
                  <img 
                    src="/dove_no_background.png" 
                    alt="Dove" 
                    className="w-20 h-16 filter drop-shadow-lg transform"
                    style={{
                      animation: 'wing-flap 0.5s ease-in-out infinite',
                    }}
                  />
                  {/* Letter attached to dove */}
                  <div className="absolute -bottom-1 right-2 w-6 h-4 bg-white border border-gray-300 transform rotate-12 shadow-sm flex items-center justify-center">
                    <span className="text-xs text-blue-600">✉</span>
                  </div>
                </div>
              </div>

              {/* Sparkle effects */}
              <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-ping"
                    style={{
                      left: `${20 + i * 7}%`,
                      top: `${40 + (i % 3) * 10}%`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: '2s'
                    }}
                  >
                    <span className="text-yellow-400 text-lg">✨</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      )}

      {activeTab === 'learning' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-blue-50 via-amber-50 to-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-amber-500" />
                Record Your Learning in Memory of Chaya Sara Leah Bas Uri zt"l
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="bg-gradient-to-r from-blue-700 via-amber-600 to-blue-700 bg-clip-text text-transparent">
                Document your Torah study, Tehillim, or other learning as a merit for her holy neshomah.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="learning-title">What did you learn? (Title/Subject)</Label>
                  <Input
                    id="learning-title"
                    type="text"
                    value={learningTitle}
                    onChange={(e) => setLearningTitle(e.target.value)}
                    placeholder="e.g., Tehillim Chapter 23, Parshat Bereishit, Mishnah..."
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learning-content">Learning Details & Insights</Label>
                  <Textarea
                    id="learning-content"
                    value={learningContent}
                    onChange={(e) => setLearningContent(e.target.value)}
                    placeholder="Share what you learned, key insights, or meaningful passages..."
                    rows={6}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-300 resize-none"
                    style={{ 
                      fontFamily: 'inherit',
                      lineHeight: '1.5',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learning-notes">Personal Reflections & Intentions</Label>
                  <Textarea
                    id="learning-notes"
                    value={learningNotes}
                    onChange={(e) => setLearningNotes(e.target.value)}
                    placeholder="How does this learning connect to Chaya Sara Leah's memory? What intentions do you have?"
                    rows={3}
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-300 resize-none"
                    style={{ 
                      fontFamily: 'inherit',
                      lineHeight: '1.5',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <Button
                    onClick={() => {
                      if (learningTitle.trim() || learningContent.trim()) {
                        // Save to localStorage for now (could be extended to save to database)
                        const learningEntry = {
                          id: Date.now(),
                          title: learningTitle.trim(),
                          content: learningContent.trim(),
                          notes: learningNotes.trim(),
                          date: new Date().toISOString(),
                        };
                        
                        const existingEntries = JSON.parse(localStorage.getItem('learningEntries') || '[]');
                        existingEntries.unshift(learningEntry);
                        localStorage.setItem('learningEntries', JSON.stringify(existingEntries));
                        
                        // Clear form
                        setLearningTitle('');
                        setLearningContent('');
                        setLearningNotes('');
                        
                        alert('Learning recorded successfully! לעילוי נשמת חיה שרה לאה בת אורי ז״ל');
                      }
                    }}
                    disabled={!learningTitle.trim() && !learningContent.trim()}
                    className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2"
                  >
                    <PenTool className="h-4 w-4" />
                    Record Learning לעילוי נשמה
                  </Button>
                  
                  <Button
                    onClick={() => {
                      const learningText = `🕯️ Learning in Memory of Chaya Sara Leah Bas Uri zt"l

📚 ${learningTitle || 'Torah Study'}
${learningContent ? `\n📖 What I learned:\n${learningContent}` : ''}
${learningNotes ? `\n💭 Personal reflection:\n${learningNotes}` : ''}

לעילוי נשמת חיה שרה לאה בת אורי ז״ל

Join me in learning Torah to elevate her holy neshomah: ${window.location.href}`;

                      if (navigator.share) {
                        navigator.share({
                          title: 'Learning in Memory of Chaya Sara Leah Bas Uri zt"l',
                          text: learningText,
                        });
                      } else {
                        navigator.clipboard.writeText(learningText);
                        alert('Learning shared to clipboard! 📋');
                      }
                    }}
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-md flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    Share Learning
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Recent Learning Entries */}
          <Card>
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 bg-clip-text text-transparent">
                Recent Learning Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(() => {
                  const entries = JSON.parse(localStorage.getItem('learningEntries') || '[]');
                  if (entries.length === 0) {
                    return (
                      <p className="text-gray-500 text-center py-4">
                        No learning entries yet. Start recording your learning above!
                      </p>
                    );
                  }
                  return entries.slice(0, 5).map((entry: any, index: number) => (
                    <div key={entry.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-blue-800">{entry.title}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      {entry.content && (
                        <p className="text-gray-700 text-sm mb-2">{entry.content}</p>
                      )}
                      {entry.notes && (
                        <p className="text-blue-600 text-sm italic">💭 {entry.notes}</p>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes dove-flight {
            0% {
              left: -100px;
              top: 60%;
              transform: rotate(0deg) scale(1);
            }
            25% {
              left: 25%;
              top: 55%;
              transform: rotate(-5deg) scale(1.1);
            }
            50% {
              left: 50%;
              top: 45%;
              transform: rotate(-10deg) scale(1.2);
            }
            75% {
              left: 75%;
              top: 30%;
              transform: rotate(-15deg) scale(1.1);
            }
            100% {
              left: 110%;
              top: 10%;
              transform: rotate(-20deg) scale(0.8);
            }
          }
          
          @keyframes wing-flap {
            0% { transform: scaleY(1); }
            50% { transform: scaleY(0.8) scaleX(1.1); }
            100% { transform: scaleY(1); }
          }
        `
      }} />
    </div>
  );
}
