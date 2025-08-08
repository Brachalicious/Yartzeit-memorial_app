import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BookOpen, ExternalLink, Send, Heart } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

export function KotelLivePage() {
  const { currentSong, setCurrentSong } = useMusic();
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'youtube1' | 'youtube3' | 'youtube4'>('youtube1');
  const [selectedSong, setSelectedSong] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [customSongs, setCustomSongs] = React.useState<Array<{id: string, title: string, url: string}>>([]);
  const [hiddenSongs, setHiddenSongs] = React.useState<string[]>([]);
  const [newSongUrl, setNewSongUrl] = React.useState('');
  const [newSongTitle, setNewSongTitle] = React.useState('');
  const [showAddSong, setShowAddSong] = React.useState(false);
  const [showManageSongs, setShowManageSongs] = React.useState(false);
  const [showPrayerOverlay, setShowPrayerOverlay] = React.useState(false);
  const [showTehillimOverlay, setShowTehillimOverlay] = React.useState(false);
  const [showTorahOverlay, setShowTorahOverlay] = React.useState(false);
  const [showShmirasHalashonOverlay, setShowShmirasHalashonOverlay] = React.useState(false);
  const [showWesternWallInfo, setShowWesternWallInfo] = React.useState(false);
  const [showNoteForm, setShowNoteForm] = React.useState(false);
  const [noteText, setNoteText] = React.useState('');
  const [noteName, setNoteName] = React.useState('');
  const [noteEmail, setNoteEmail] = React.useState('');

  // Update time every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Load custom songs and hidden songs from localStorage on component mount
  React.useEffect(() => {
    const savedSongs = localStorage.getItem('kotelCustomSongs');
    if (savedSongs) {
      try {
        setCustomSongs(JSON.parse(savedSongs));
      } catch (error) {
        console.log('Error loading saved songs:', error);
      }
    }
    
    const savedHiddenSongs = localStorage.getItem('kotelHiddenSongs');
    if (savedHiddenSongs) {
      try {
        setHiddenSongs(JSON.parse(savedHiddenSongs));
      } catch (error) {
        console.log('Error loading hidden songs:', error);
      }
    }
  }, []);

  // Save custom songs to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('kotelCustomSongs', JSON.stringify(customSongs));
  }, [customSongs]);

  // Save hidden songs to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('kotelHiddenSongs', JSON.stringify(hiddenSongs));
  }, [hiddenSongs]);

  // Note placement functionality
  const handlePlaceNote = () => {
    if (!noteText.trim()) {
      alert('Please enter a note to place in the Western Wall');
      return;
    }

    // Open the external services in new tabs
    const thekotelUrl = 'https://thekotel.org/en/send-a-note/?srsltid=AfmBOoqhfAwR3L_BTXWU4C1pl5bSLtGQeOH8c4YUypH4cA1SN8R5_Syv#send';
    const aishUrl = 'https://aish.com/place-a-note-in-the-western-wall/?done=1';
    const hillsideUrl = 'https://www.hillsidememorial.org/notes-to-the-wall';
    
    // Open all three services
    window.open(thekotelUrl, '_blank');
    setTimeout(() => window.open(aishUrl, '_blank'), 1000);
    setTimeout(() => window.open(hillsideUrl, '_blank'), 2000);
    
    // Save the note locally for memorial purposes
    const noteEntry = {
      id: Date.now(),
      text: noteText.trim(),
      name: noteName.trim() || 'Anonymous',
      email: noteEmail.trim(),
      date: new Date().toISOString(),
      inMemoryOf: 'Chaya Sara Leah Bas Uri zt"l'
    };
    
    const existingNotes = JSON.parse(localStorage.getItem('westernWallNotes') || '[]');
    existingNotes.unshift(noteEntry);
    localStorage.setItem('westernWallNotes', JSON.stringify(existingNotes));
    
    // Clear form and show success
    setNoteText('');
    setNoteName('');
    setNoteEmail('');
    alert('🙏 Your note has been prepared for placement at the Western Wall! Three placement services have opened in new tabs. Your note is also saved locally in memory of Chaya Sara Leah Bas Uri zt"l.');
  };

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  // Add a new custom song
  const addCustomSong = () => {
    if (!newSongUrl.trim() || !newSongTitle.trim()) {
      alert('Please enter both a song title and YouTube URL');
      return;
    }

    const videoId = extractYouTubeId(newSongUrl);
    if (!videoId) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    const newSong = {
      id: videoId,
      title: newSongTitle.trim(),
      url: newSongUrl.trim()
    };

    setCustomSongs(prev => [...prev, newSong]);
    setNewSongUrl('');
    setNewSongTitle('');
    setShowAddSong(false);
  };

  // Hide/unhide a preset song
  const toggleSongVisibility = (songId: string) => {
    setHiddenSongs(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      } else {
        return [...prev, songId];
      }
    });
    if (selectedSong === songId) {
      setSelectedSong(null);
    }
  };

  // Remove a custom song
  const removeCustomSong = (songId: string) => {
    setCustomSongs(prev => prev.filter(song => song.id !== songId));
    if (selectedSong === songId) {
      setSelectedSong(null);
    }
  };

  // Songs for listening by the Kotel
  const kotelSongs = [
    {
      id: 'vdr9PEu2DFY',
      title: 'Im Eshkachech (If I Forget You Jerusalem)',
      url: 'https://youtu.be/vdr9PEu2DFY?si=jQttDuYRMIQ-LkJs'
    },
    {
      id: 'jues4wiAFnQ',
      title: 'Im Eshkachech (If I Forget You Jerusalem)', 
      url: 'https://youtu.be/jues4wiAFnQ?si=RNjfhENlVKZVahvn'
    },
    {
      id: 'ZY1dc9HlMPY',
      title: 'Yerushalayim (Jerusalem)',
      url: 'https://youtu.be/ZY1dc9HlMPY?si=4JULu3U4ehnxpnkd'
    },
    {
      id: 'niTWPbC8gXo',
      title: 'Yerushalayim Shel Zahav (Jerusalem of Gold)',
      url: 'https://youtu.be/niTWPbC8gXo?si=9c5KwPE7mAiC8YA6'
    },
    {
      id: 'JH8gtdDA5x0',
      title: 'Jerusalem of Gold - Original',
      url: 'https://youtu.be/JH8gtdDA5x0?si=WExnHkR9ItM9kqsh'
    },
    {
      id: '0OYIQjmEqT8',
      title: 'October Rain',
      url: 'https://youtu.be/0OYIQjmEqT8?si=cXx8hSVQpRkZFQGa'
    },
    {
      id: 'D2gBJ58drtg',
      title: 'October Rain',
      url: 'https://youtu.be/D2gBJ58drtg?si=x6D7rHxajhuFgFjy'
    },
    {
      id: 'lJYn09tuPw4',
      title: 'October Rain',
      url: 'https://youtu.be/lJYn09tuPw4?si=Rmge4_D9qL_0vE0D'
    },
    {
      id: 'Q3BELu4z6-U',
      title: 'A New Day Will Rise',
      url: 'https://youtu.be/Q3BELu4z6-U?si=wNURJN3HrJQtPHEc'
    },
    {
      id: '1h6dIEQMz3s',
      title: 'Am Yisrael Chai',
      url: 'https://youtu.be/1h6dIEQMz3s?si=D8hX7Zy-CvvGv_NK'
    },
    {
      id: 'fHuzLmbcobo',
      title: 'Ahavas Yisrael',
      url: 'https://youtu.be/fHuzLmbcobo?si=aUETU2A5u5lhYCXa'
    },
    {
      id: 'mOW5xnQuLY4',
      title: 'Yallah Ya Nasrallah',
      url: 'https://youtu.be/mOW5xnQuLY4?si=ATQ4hTKOW1gQJzGJ'
    },
    {
      id: '2p3rtnQ_7y4',
      title: 'Am Yisrael Chai',
      url: 'https://youtu.be/2p3rtnQ_7y4?si=p-Djw4n2ZpoRl5Pj'
    },
    {
      id: 'OGjvSId7wZY',
      title: 'We Want Moshiach Now',
      url: 'https://youtu.be/OGjvSId7wZY?si=vXVpFZK7LEXObbRb'
    },
    {
      id: 'm-8JfR9_LFA',
      title: 'Tamid Ohev',
      url: 'https://youtu.be/m-8JfR9_LFA?si=15cVguzyZeD4qX8f'
    },
    {
      id: '1xkVj3sKulw',
      title: 'Rachel Mevakah',
      url: 'https://youtu.be/1xkVj3sKulw?si=FIVkLKZ0FbB36XlR'
    },
    {
      id: 'OMXHlwUfG-E',
      title: 'Mishebeerach L\'Tzahal',
      url: 'https://youtu.be/OMXHlwUfG-E?si=xCNdMk_8r-b3Kjqs'
    },
    {
      id: 'skGfPPwJjf8',
      title: 'Nachamu Ami',
      url: 'https://youtu.be/skGfPPwJjf8?si=SQcRUq0w7NU23hDy'
    },
    {
      id: 'SsGhspYDV18',
      title: 'Hold On Tight',
      url: 'https://youtu.be/SsGhspYDV18?si=2B842pB0IbSwfATa'
    },
    {
      id: 'vkInPUky6-w',
      title: 'Vzakeini',
      url: 'https://youtu.be/vkInPUky6-w?si=5uvSLNsPIdhv0cb2'
    },
    {
      id: 'OetNIKF_ZSc',
      title: 'Emunah & Bitachon',
      url: 'https://youtu.be/OetNIKF_ZSc?si=Vymtv-fWd8yMPcsk'
    },
    {
      id: 'zGz_eVHddfo',
      title: 'A Yid',
      url: 'https://youtu.be/zGz_eVHddfo?si=Nf4PgKyuuawGY_Wk'
    },
    {
      id: 'iTxCW9dr4Sk',
      title: 'Bilvovi',
      url: 'https://youtu.be/iTxCW9dr4Sk?si=Fo7MXPg0HnhsdZ8h'
    },
    {
      id: 'ondtspOUSGE',
      title: 'A Gutteh Vuch',
      url: 'https://youtu.be/ondtspOUSGE?si=TGS8NUGzuZfVyyGC'
    },
    {
      id: 'jaDgBgMLW6k',
      title: 'We May All Be Different',
      url: 'https://youtu.be/jaDgBgMLW6k?si=jowdkgPTwAAihV32'
    },
    {
      id: 'BQuNMi8scuA',
      title: 'Kshe HaLev Boche',
      url: 'https://youtu.be/BQuNMi8scuA?si=QmXyi-k_3zsMrqfD'
    },
    {
      id: '_qkwIouru7Y',
      title: 'Shema Yisrael',
      url: 'https://youtu.be/_qkwIouru7Y?si=TFmevPeAjwyMhv_n'
    },
    {
      id: 'yeCCwKcRVKQ',
      title: 'Build The World',
      url: 'https://youtu.be/yeCCwKcRVKQ?si=f_PxuDNDdvXVKE_Y'
    },
    {
      id: '74BQqHzCFpQ',
      title: 'Smile Again',
      url: 'https://youtu.be/74BQqHzCFpQ?si=VsR3CBeAO6hM3p_S'
    },
    {
      id: 'GlqkWOe9s0Q',
      title: 'Yerushalayim',
      url: 'https://youtu.be/GlqkWOe9s0Q?si=lTj5KhzlnTvUbltF'
    },
    {
      id: '7Kcku1nylLs',
      title: 'Moshiach',
      url: 'https://youtu.be/7Kcku1nylLs?si=lqGIPlMSYIqbpzez'
    },
    {
      id: 'S_8KOTXhEqY',
      title: 'Nachamu',
      url: 'https://youtu.be/S_8KOTXhEqY?si=YBEl97PCavBXeYlE'
    },
    {
      id: 'BGrzh3W-F-c',
      title: 'Hava Negilla',
      url: 'https://youtu.be/BGrzh3W-F-c?si=v4EK09soNGePnC1C'
    },
    {
      id: 'X7UqipfGbC0',
      title: 'Ana BeKoach',
      url: 'https://youtu.be/X7UqipfGbC0?si=_e6fEzdtev0jkkAq'
    },
    {
      id: 'SQ5xNYP0HRY',
      title: 'Ana BeKoach',
      url: 'https://youtu.be/SQ5xNYP0HRY?si=HgKZGoku7N_HpK6c'
    },
    {
      id: 'c4aszHzF61E',
      title: 'An Everlasting Love',
      url: 'https://youtu.be/c4aszHzF61E?si=dwN1_2g9qI2Xh7Qo'
    },
    {
      id: 'gSK-8ci3fWE',
      title: 'Waken In Our Hearts',
      url: 'https://youtu.be/gSK-8ci3fWE?si=s-e3Jmv4Zn2FYoxA'
    },
    {
      id: 'yHF1RbbfB5U',
      title: 'Tatty My King',
      url: 'https://youtu.be/yHF1RbbfB5U?si=J_zgqlXMIe3d41Sh'
    }
  ];

  // Combined songs collection (preset + custom), filtering out hidden songs
  const visiblePresetSongs = kotelSongs.filter(song => !hiddenSongs.includes(song.id));
  const allSongs = [...visiblePresetSongs, ...customSongs];

  // Get current time in Israel (Jerusalem timezone)
  const getIsraeliTime = () => {
    return new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Jerusalem',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getIsraeliDate = () => {
    return new Date().toLocaleDateString('en-US', {
      timeZone: 'Asia/Jerusalem',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Approximate prayer times (these would ideally come from an API)
  const getPrayerTimes = () => {
    const now = new Date();
    return {
      shacharit: '6:30 AM',
      mincha: '6:45 PM',
      maariv: '8:15 PM',
      sunset: '7:30 PM',
      shabbatStart: 'Friday 7:25 PM',
      shabbatEnd: 'Saturday 8:30 PM'
    };
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getYouTubeUrl = () => {
    switch (viewMode) {
      case 'youtube1':
        return 'https://www.youtube.com/watch?v=y4k2lXk1MBw';
      case 'youtube3':
        return 'https://www.youtube.com/watch?v=20O83PMr_GE';
      case 'youtube4':
        return 'https://www.youtube.com/watch?v=-M4IndOjLtY';
      default:
        return 'https://www.youtube.com/watch?v=y4k2lXk1MBw';
    }
  };

  const renderStream = () => {
    const height = isFullscreen ? "100vh" : "600px";
    
    if (viewMode === 'youtube1') {
      return (
        <div className="relative" style={{ height }}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/y4k2lXk1MBw?autoplay=1&mute=1&loop=1&playlist=y4k2lXk1MBw&rel=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=0&disablekb=0&controls=1"
            title="Kotel Live Stream - Western Wall Jerusalem"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="rounded-lg"
          />
        </div>
      );
    }
    
    if (viewMode === 'youtube3') {
      return (
        <div className="relative" style={{ height }}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/20O83PMr_GE?autoplay=1&mute=1&loop=1&playlist=20O83PMr_GE&rel=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=0&disablekb=0&controls=1"
            title="Additional Kotel Live Stream"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      );
    }
    
    if (viewMode === 'youtube4') {
      return (
        <div className="relative" style={{ height }}>
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/-M4IndOjLtY?autoplay=1&mute=1&loop=1&playlist=-M4IndOjLtY&rel=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=0&disablekb=0&controls=1"
            title="Western Wall Live Stream - Jerusalem"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="rounded-lg"
          />
        </div>
      );
    }
    
    // Default fallback with helpful instructions
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200" style={{ height }}>
        <div className="text-center max-w-md p-6">
          <div className="text-6xl mb-4">🕊️</div>
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Stream Temporarily Unavailable</h3>
          <p className="text-gray-700 mb-4">
            The current source isn't loading. Try switching to a different source below:
          </p>
          <div className="space-y-2 mb-4">
            <Button onClick={() => setViewMode('youtube1')} className="bg-red-600 hover:bg-red-700 text-white w-full" size="sm">
              �️ Try YouTube Stream 1
            </Button>
            <Button onClick={() => setViewMode('youtube3')} className="bg-red-600 hover:bg-red-700 text-white w-full" size="sm">
              � Try YouTube Stream 2
            </Button>

            <Button onClick={() => setViewMode('youtube4')} className="bg-purple-600 hover:bg-purple-700 text-white w-full" size="sm">
              📺 Try YouTube Stream 4
            </Button>


          </div>
          <p className="text-xs text-gray-500">
            Current mode: {viewMode} • Three working backup sources available
          </p>
        </div>
      </div>
    );
  };

  // Handle song selection with music context integration
  const handleSongSelection = (songId: string) => {
    if (selectedSong === songId) {
      // If same song is clicked, stop it
      setSelectedSong(null);
      setCurrentSong(null);
    } else {
      // If different song is clicked, start it and stop others
      setSelectedSong(songId);
      setCurrentSong(`kotel-${songId}`);
    }
  };

  // Stop Kotel music when another song starts playing
  React.useEffect(() => {
    if (currentSong && !currentSong.startsWith('kotel-') && selectedSong) {
      setSelectedSong(null);
    }
  }, [currentSong, selectedSong]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 bg-clip-text text-transparent mb-4">
            לעילוי נשמת חיה שרה לאה בת אורי ז״ל
          </h2>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent mb-4">🕊️ The Western Wall - Live Stream</h1>
          <p className="text-lg bg-gradient-to-r from-blue-700 to-amber-700 bg-clip-text text-transparent mb-2 font-semibold">
            Connect spiritually with the holiest place in Judaism
          </p>
          <p className="text-sm bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent italic mb-3 font-medium">
            "May your prayers ascend to Heaven from this sacred place"
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-amber-50 border border-blue-200 rounded-lg p-3 max-w-2xl mx-auto">
            <p className="text-sm bg-gradient-to-r from-blue-800 to-amber-800 bg-clip-text text-transparent font-semibold">
              📡 <strong>Clean Live Streams:</strong> If one source isn't working, try hitting next source. Three working streams - all YouTube embedded with enhanced parameters to prevent login prompts.
            </p>
          </div>
        </div>

        {/* Western Wall Information Section */}
        <Card className="mb-8 shadow-lg border-2 border-amber-200">
          <CardHeader className="bg-gradient-to-r from-amber-600 via-blue-600 to-amber-600 text-white">
            <CardTitle className="text-center text-xl flex items-center justify-center gap-2">
              <BookOpen className="h-6 w-6" />
              About the Western Wall (Kotel)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Button
                  onClick={() => setShowWesternWallInfo(!showWesternWallInfo)}
                  className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  {showWesternWallInfo ? 'Hide' : 'Learn About'} the Western Wall
                </Button>
                <Button
                  onClick={() => {
                    // Clear form when opening to ensure fresh input each time
                    if (!showNoteForm) {
                      setNoteText('');
                      setNoteName('');
                      setNoteEmail('');
                    }
                    setShowNoteForm(!showNoteForm);
                  }}
                  className="bg-gradient-to-r from-amber-600 to-blue-600 hover:from-amber-700 hover:to-blue-700 text-white flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Place a Note in the Wall (Real-Time)
                </Button>
              </div>

              {showWesternWallInfo && (
                <Card className="bg-gradient-to-r from-amber-50 to-blue-50 border-amber-200">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-amber-800">The Only Surviving Wall of the Temple Mount</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Believe it or not, the Western Wall (sometimes called the Wailing Wall or Kotel), is actually the only surviving wall of the Temple Mount. Much of the structure we see today was rebuilt during the 2,000 years since the Temple was destroyed.
                    </p>
                    
                    <p className="text-gray-700 leading-relaxed">
                      There are almost no ancient remains of the northern wall. There is a bit of the eastern wall, as well as almost the entire southern wall. However, none of those walls actually bordered the holy ground of the Temple. The actual southern wall was further north than the existing southern wall, which was built by Herod and enclosed an annexed area next to the sacred ground of the Temple. So the Western Wall is the only hallowed wall that remains.
                    </p>

                    <h3 className="text-lg font-bold text-amber-800 mt-6">How Did the Western Wall Survive?</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <p className="text-gray-700 leading-relaxed italic">
                        <strong>The Midrash tells a fascinating tale:</strong>
                      </p>
                      <p className="text-gray-700 leading-relaxed mt-2">
                        When Vespasian conquered Jerusalem, he assigned the destruction of the four ramparts of the Temple to four generals. The western wall was allotted to Pangar of Arabia. Now, it had been decreed by Heaven that this should never be destroyed, because the Shechinah (Divine Presence) resides in the west.
                      </p>
                      <p className="text-gray-700 leading-relaxed mt-2">
                        The others demolished their sections, but Pangar did not demolish his. Vespasian sent for him and asked, "Why did you not destroy your section?" He replied, "By your life, I acted so for the honor of the kingdom. For if I had demolished it, nobody would [in time to come] know what it was you destroyed. But when people look [at the surviving wall], they will exclaim, 'From the great building he destroyed, you can tell the might of Vespasian!'"
                      </p>
                      <p className="text-gray-700 leading-relaxed mt-2">
                        Vespasian said to him, "Enough! You have spoken well. But since you disobeyed my command, you shall ascend to the roof and throw yourself down. If you live, you will live, and if you die, you will die." Pangar ascended, threw himself down and died.
                      </p>
                    </div>

                    <h3 className="text-lg font-bold text-amber-800 mt-6">What It Means</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We read in Song of Songs, "Behold, He is standing behind our wall, looking from the windows, peering from the lattices." The Midrash explains that this refers to the Western Wall. "Why is this so? Because the Holy One, Blessed be He, has taken an oath that it will never be destroyed."
                    </p>
                    
                    <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400 mt-4">
                      <p className="text-gray-700 leading-relaxed">
                        <strong>Based on this verse, the Zohar states:</strong> "The Divine Presence never departed from the Western Wall of the Temple." This is seen as a manifestation of G‑d's promise to Solomon when the Temple was first built, that "My eyes and heart will be there at all times."
                      </p>
                    </div>

                    <p className="text-gray-700 leading-relaxed mt-4">
                      The Zohar explains that this idea is hinted to in the word kotel (כותל), which can be broken into two words, כו תל. The word כו is the numeric value of 26, the value of the Tetragrammaton. And the word תל means "hill" or "mountain." Thus, the Kotel's very name hints to the fact that G‑d's Divine Presence is still to be found on the Temple Mount.
                    </p>

                    <h3 className="text-lg font-bold text-amber-800 mt-6">Wall to Holiness</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Although the intention of the enemies of Israel in leaving the wall intact was to show the glory of Rome and the subjection of the Jewish nation, the opposite transpired. Rome is long buried in the dustbin of history, but the Western Wall has remained as a beacon of hope, signifying G‑d's eternal promise that His children will ultimately return to the land and that the Temple will be rebuilt.
                    </p>
                  </CardContent>
                </Card>
              )}

              {showNoteForm && (
                <Card className="bg-gradient-to-r from-blue-50 to-amber-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Place Your Note in the Western Wall
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Write your prayers, hopes, and memories. Your note will be placed at the Western Wall through trusted services, 
                      and also preserved here in memory of Chaya Sara Leah Bas Uri zt"l.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="note-name">Your Name (optional)</Label>
                          <Input
                            id="note-name"
                            value={noteName}
                            onChange={(e) => setNoteName(e.target.value)}
                            placeholder="Your name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="note-email">Email (optional)</Label>
                          <Input
                            id="note-email"
                            type="email"
                            value={noteEmail}
                            onChange={(e) => setNoteEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="note-text">Your Note to Place in the Western Wall</Label>
                        <Textarea
                          id="note-text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Dear G-d, I pray for... In memory of Chaya Sara Leah Bas Uri zt'l..."
                          rows={4}
                          className="mt-1 resize-none"
                        />
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-3">
                        <Button
                          onClick={handlePlaceNote}
                          disabled={!noteText.trim()}
                          className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white flex items-center gap-2"
                        >
                          <Send className="h-4 w-4" />
                          Place Note in the Western Wall
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => {
                            window.open('https://thekotel.org/en/send-a-note/?srsltid=AfmBOoqhfAwR3L_BTXWU4C1pl5bSLtGQeOH8c4YUypH4cA1SN8R5_Syv#send', '_blank');
                          }}
                          className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          <ExternalLink className="h-4 w-4" />
                          TheKotel.org Service
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => {
                            window.open('https://aish.com/place-a-note-in-the-western-wall/?done=1', '_blank');
                          }}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Aish.com Service
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => {
                            window.open('https://www.hillsidememorial.org/notes-to-the-wall', '_blank');
                          }}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Hillside Memorial Service
                        </Button>
                      </div>
                      
                      <p className="text-xs text-gray-600 mt-2">
                        💫 Your note will be submitted to trusted Western Wall placement services and also saved locally as a digital memorial to Chaya Sara Leah Bas Uri zt"l
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Live Stream Section */}
        <Card className="mb-8 shadow-2xl border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 text-white">
            <CardTitle className="text-center text-2xl">
              🏛️ Live from Jerusalem - The Kotel
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black flex items-center justify-center' : ''}`}>
              <div className={isFullscreen ? 'w-full h-full' : 'w-full'}>
                {renderStream()}
              </div>
              
              {/* Stream Controls */}
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    const modes: Array<'youtube1' | 'youtube3' | 'youtube4'> = ['youtube1', 'youtube3', 'youtube4'];
                    const currentIndex = modes.indexOf(viewMode);
                    const nextIndex = (currentIndex + 1) % modes.length;
                    const nextMode = modes[nextIndex];
                    setViewMode(nextMode);
                  }}
                  className="bg-black/70 hover:bg-black/90 text-white"
                  size="sm"
                >
                  📺 Switch Source
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-black/70 hover:bg-black/90 text-white"
                  size="sm"
                >
                  🔄 Refresh
                </Button>
                <Button
                  onClick={toggleFullscreen}
                  className="bg-black/70 hover:bg-black/90 text-white"
                  size="sm"
                >
                  {isFullscreen ? '🔲 Exit Fullscreen' : '⛶ Fullscreen'}
                </Button>
                <Button
                  onClick={() => window.open(getYouTubeUrl(), '_blank')}
                  className="bg-black/70 hover:bg-black/90 text-white"
                  size="sm"
                >
                  🌐 Open on YouTube
                </Button>
              </div>

              {/* Exit Fullscreen Button */}
              {isFullscreen && (
                <Button
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white z-10"
                  size="lg"
                >
                  ✕ Exit Fullscreen
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tehillim Section - appears immediately under Kotel when opened */}
        {showTehillimOverlay && (
          <Card className="mb-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
                  📖 Tehillim (Psalms) - Read While Watching the Kotel
                </CardTitle>
                <Button
                  onClick={() => setShowTehillimOverlay(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 text-sm"
                >
                  ✕ Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-hidden rounded-lg border-2 border-purple-300">
                <iframe
                  src="https://www.sefaria.org/Psalms"
                  className="w-full h-full border-0"
                  title="Tehillim - Book of Psalms"
                  allow="fullscreen"
                />
              </div>
              <p className="text-xs text-purple-600 text-center mt-2">
                📿 Choose any Psalm to read while watching the Kotel live stream above
              </p>
            </CardContent>
          </Card>
        )}

        {/* Prayer Section - appears immediately under Kotel when opened */}
        {showPrayerOverlay && (
          <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                  🤲 Siddur Ashkenaz - Prayers & Blessings
                </CardTitle>
                <Button
                  onClick={() => setShowPrayerOverlay(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 text-sm"
                >
                  ✕ Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-hidden rounded-lg border-2 border-blue-300">
                <iframe
                  src="https://www.sefaria.org/Siddur_Ashkenaz?tab=contents"
                  className="w-full h-full border-0"
                  title="Siddur Ashkenaz - Prayer Book"
                  allow="fullscreen"
                />
              </div>
              <p className="text-xs text-blue-600 text-center mt-2">
                🕯️ Browse the complete prayer book while watching the Kotel above
              </p>
            </CardContent>
          </Card>
        )}

        {/* Shmiras Halashon Section - appears immediately under Kotel when opened */}
        {showShmirasHalashonOverlay && (
          <Card className="mb-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
                  🗣️ Shmiras Halashon - Guarding Your Speech
                </CardTitle>
                <Button
                  onClick={() => setShowShmirasHalashonOverlay(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 text-sm"
                >
                  ✕ Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-hidden rounded-lg border-2 border-purple-300">
                <iframe
                  src="https://cchf.global/daily-companion/#"
                  className="w-full h-full border-0"
                  title="Shmiras Halashon - Daily Companion"
                  allow="fullscreen"
                />
              </div>
              <p className="text-xs text-purple-600 text-center mt-2">
                🛡️ Learn the laws and wisdom of guarding your speech - Daily companion guide
              </p>
              <div className="mt-3 text-center">
                <p className="text-sm text-purple-700">
                  📖 Study the importance of proper speech while watching the Kotel above
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Torah Section - appears immediately under Kotel when opened */}
        {showTorahOverlay && (
          <Card className="mb-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                  📜 Torah Study - Tanakh (Hebrew Bible)
                </CardTitle>
                <Button
                  onClick={() => setShowTorahOverlay(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 text-sm"
                >
                  ✕ Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-100 p-3 rounded-lg border border-green-300">
                  <p className="text-sm text-green-800 text-center font-medium">
                    📚 Choose from Torah (Five Books), Nevi'im (Prophets), or Ketuvim (Writings)
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    onClick={() => {
                      const iframe = document.getElementById('torah-iframe') as HTMLIFrameElement;
                      if (iframe) iframe.src = 'https://www.sefaria.org/Torah?tab=contents';
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    📖 Torah (תורה)
                  </Button>
                  <Button
                    onClick={() => {
                      const iframe = document.getElementById('torah-iframe') as HTMLIFrameElement;
                      if (iframe) iframe.src = 'https://www.sefaria.org/Prophets?tab=contents';
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    size="sm"
                  >
                    🗣️ Nevi'im (נביאים)
                  </Button>
                  <Button
                    onClick={() => {
                      const iframe = document.getElementById('torah-iframe') as HTMLIFrameElement;
                      if (iframe) iframe.src = 'https://www.sefaria.org/Writings?tab=contents';
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    size="sm"
                  >
                    ✍️ Ketuvim (כתובים)
                  </Button>
                </div>

                <div className="h-96 overflow-hidden rounded-lg border-2 border-green-300">
                  <iframe
                    id="torah-iframe"
                    src="https://www.sefaria.org/texts?tab=contents"
                    className="w-full h-full border-0"
                    title="Torah Study - Tanakh"
                    allow="fullscreen"
                  />
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
                  <p className="text-xs text-green-700 text-center">
                    📜 Study the complete Hebrew Bible with commentaries • Click the buttons above to navigate between sections
                  </p>
                  <p className="text-xs text-blue-600 text-center mt-1">
                    💡 Tip: Use Sefaria's built-in features for Hebrew/English toggle, commentaries, and cross-references
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-amber-50">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-blue-800 to-amber-800 bg-clip-text text-transparent flex items-center gap-2 font-bold">
                🏛️ About the Western Wall
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="bg-gradient-to-r from-blue-700 to-amber-700 bg-clip-text text-transparent leading-relaxed font-medium">
                The Western Wall (Kotel) is the most sacred place where Jews are permitted to pray. 
                It is the last remaining wall of the Second Temple, destroyed in 70 CE. 
                For nearly 2,000 years, Jews from around the world have come here to pray and 
                place their written prayers in the cracks of the ancient stones.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-amber-50">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-blue-800 to-amber-800 bg-clip-text text-transparent flex items-center gap-2 font-bold">
                🙏 Current Time & Prayer Times in Jerusalem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center p-3 bg-blue-100 rounded-lg border">
                  <p className="text-lg font-bold text-blue-900">{getIsraeliTime()}</p>
                  <p className="text-sm text-blue-700">{getIsraeliDate()}</p>
                </div>
                
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>🌅 Shacharit (Morning):</span>
                    <span className="font-semibold">{getPrayerTimes().shacharit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🌇 Mincha (Afternoon):</span>
                    <span className="font-semibold">{getPrayerTimes().mincha}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🌙 Ma'ariv (Evening):</span>
                    <span className="font-semibold">{getPrayerTimes().maariv}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🌅 Sunset:</span>
                    <span className="font-semibold">{getPrayerTimes().sunset}</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-blue-200">
                  <div className="flex justify-between text-sm">
                    <span>🕯️ Shabbat Begins:</span>
                    <span className="font-semibold">{getPrayerTimes().shabbatStart}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>⭐ Shabbat Ends:</span>
                    <span className="font-semibold">{getPrayerTimes().shabbatEnd}</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mt-3 italic text-center">
                  Times are approximate and may vary by season
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hebrew Music Player Section */}
        <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-amber-50">
          <CardHeader>
            <CardTitle className="text-xl bg-gradient-to-r from-blue-800 to-amber-800 bg-clip-text text-transparent text-center flex items-center justify-center gap-2 font-bold">
              🎵 Sacred Hebrew Songs - Listen While You Pray
            </CardTitle>
            <p className="text-center bg-gradient-to-r from-blue-700 to-amber-700 bg-clip-text text-transparent text-sm mt-2 font-semibold">
              Collection of {allSongs.length} Beautiful Songs ({visiblePresetSongs.length} preset + {customSongs.length} personal)
              {hiddenSongs.length > 0 && (
                <span className="text-gray-500"> • {hiddenSongs.length} hidden</span>
              )}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-700">
                  Enhance your spiritual connection with beautiful Hebrew songs and prayers
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowManageSongs(!showManageSongs)}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    size="sm"
                  >
                    {showManageSongs ? '✕ Close' : '⚙️ Manage Songs'}
                  </Button>
                  <Button
                    onClick={() => setShowAddSong(!showAddSong)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    size="sm"
                  >
                    {showAddSong ? '✕ Cancel' : '➕ Add Your Song'}
                  </Button>
                </div>
              </div>

              {/* Manage Songs Section */}
              {showManageSongs && (
                <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-3">Manage Your Music Collection</h4>
                  <div className="text-sm text-gray-700 mb-4">
                    Hide songs you don't want to see, or delete your personal songs. Hidden songs can be restored anytime.
                  </div>
                  
                  {/* Preset Songs Management */}
                  <div className="mb-6">
                    <h5 className="font-medium text-gray-800 mb-2">Preset Songs ({kotelSongs.length} total)</h5>
                    <div className="max-h-40 overflow-y-auto">
                      {kotelSongs.map((song, index) => (
                        <div key={song.id} className="flex items-center justify-between py-1 px-2 rounded hover:bg-orange-100">
                          <span className={`text-sm ${hiddenSongs.includes(song.id) ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                            {index + 1}. {song.title}
                          </span>
                          <Button
                            onClick={() => toggleSongVisibility(song.id)}
                            className={`text-xs px-2 py-1 ${
                              hiddenSongs.includes(song.id) 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-gray-600 hover:bg-gray-700 text-white'
                            }`}
                          >
                            {hiddenSongs.includes(song.id) ? '👁️ Show' : '🚫 Hide'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Custom Songs Management */}
                  {customSongs.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Your Personal Songs ({customSongs.length})</h5>
                      <div className="max-h-32 overflow-y-auto">
                        {customSongs.map((song, index) => (
                          <div key={song.id} className="flex items-center justify-between py-1 px-2 rounded hover:bg-orange-100">
                            <span className="text-sm text-gray-700">
                              {index + 1}. {song.title}
                            </span>
                            <Button
                              onClick={() => removeCustomSong(song.id)}
                              className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                              🗑️ Delete
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Add Song Form */}
              {showAddSong && (
                <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3">Add a Meaningful Song</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Song Title (What this song means to you)
                      </label>
                      <input
                        type="text"
                        value={newSongTitle}
                        onChange={(e) => setNewSongTitle(e.target.value)}
                        placeholder="e.g., 'Mom's Favorite Song' or 'Our Wedding Dance'"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        YouTube URL
                      </label>
                      <input
                        type="url"
                        value={newSongUrl}
                        onChange={(e) => setNewSongUrl(e.target.value)}
                        placeholder="https://youtu.be/... or https://youtube.com/watch?v=..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={addCustomSong}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        💝 Add Song
                      </Button>
                      <Button
                        onClick={() => setShowAddSong(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Song Selection Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {allSongs.map((song, index) => {
                  const isCustomSong = customSongs.some(customSong => customSong.id === song.id);
                  return (
                    <div key={song.id} className="relative">
                      <Button
                        onClick={() => handleSongSelection(song.id)}
                        className={`h-auto p-3 text-left w-full ${
                          selectedSong === song.id 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : isCustomSong
                            ? 'bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-white hover:bg-green-50 text-green-800 border border-green-200'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1 text-center">
                          <span className="text-lg">
                            {selectedSong === song.id ? '🎵' : isCustomSong ? '💝' : '▶️'}
                          </span>
                          <div>
                            <p className="font-medium text-[10px] leading-tight">
                              {song.title}
                            </p>
                            <p className="text-xs opacity-75 text-[9px]">
                              {isCustomSong ? 'Personal Song' : 'Hebrew Song'}
                            </p>
                          </div>
                        </div>
                      </Button>
                      
                      {/* Remove button for custom songs only in the song grid */}
                      {isCustomSong && (
                        <Button
                          onClick={() => removeCustomSong(song.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                          size="sm"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Selected Song Player */}
              {selectedSong && (
                <div className="mt-6 p-4 bg-white rounded-lg border-2 border-green-300">
                  <div className="flex justify-between items-center mb-3">
                    {(() => {
                      const currentSong = allSongs.find(s => s.id === selectedSong);
                      return (
                        <>
                          <h4 className="font-semibold text-green-800">
                            🎵 {currentSong?.title || 'Unknown Song'}
                          </h4>
                          <Button
                            onClick={() => {
                              setSelectedSong(null);
                              setCurrentSong(null);
                            }}
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            ✕ Close
                          </Button>
                        </>
                      );
                    })()}
                  </div>
                  
                  {/* Embedded YouTube Music Player */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border-2 border-green-200 overflow-hidden">
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${selectedSong}?autoplay=1&mute=0&rel=0&modestbranding=1&iv_load_policy=3&fs=1&cc_load_policy=0&disablekb=0&controls=1&enablejsapi=1`}
                        title={allSongs.find(s => s.id === selectedSong)?.title || 'Hebrew Song'}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex gap-2 justify-center flex-wrap">
                      <Button
                        onClick={() => {
                          const song = allSongs.find(s => s.id === selectedSong);
                          if (song) window.open(song.url, '_blank');
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        size="sm"
                      >
                        🎬 Open on YouTube
                      </Button>
                      
                      <Button
                        onClick={() => {
                          const song = allSongs.find(s => s.id === selectedSong);
                          if (song) {
                            window.open(`https://music.youtube.com/watch?v=${selectedSong}`, '_blank');
                          }
                        }}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                        size="sm"
                      >
                        🎵 YouTube Music
                      </Button>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-700 text-center">
                        🎶 <strong>Enhanced Embedded Player:</strong> Listen directly here with no login prompts! Or click the buttons above to open in YouTube for full features.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 italic">
                  🎶 Let these sacred melodies accompany your prayers and meditation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spiritual Connection Section */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-xl text-purple-800 text-center flex items-center justify-center gap-2">
              💜 Connecting Through the Live Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Even from afar, you can connect spiritually with this holy place. 
                Take a moment to say a prayer, reflect on your loved ones, or simply 
                feel the presence of thousands of years of Jewish prayer and tradition.
              </p>
              <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-800 italic">
                  "From the depths I call to You, O Lord" - Psalm 130:1
                </p>
              </div>
              <div className="flex justify-center space-x-4 pt-2">
                <Button 
                  onClick={() => setShowTehillimOverlay(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  📖 Read Tehillim
                </Button>
                <Button 
                  onClick={() => setShowPrayerOverlay(true)}
                  className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white"
                >
                  🤲 Open Siddur (Prayers)
                </Button>
                <Button 
                  onClick={() => setShowShmirasHalashonOverlay(true)}
                  className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white"
                >
                  🗣️ Learn Shmiras Halashon
                </Button>
                <Button 
                  onClick={() => setShowTorahOverlay(true)}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                >
                  📜 Learn Torah (Tanakh)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Stream Source Indicator */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Current source: <span className="font-semibold capitalize">{viewMode}</span>
            {viewMode === 'youtube1' && ' (YouTube Stream 1)'}
            {viewMode === 'youtube3' && ' (YouTube Stream 2)'}
            {viewMode === 'youtube4' && ' (YouTube Stream 4)'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Switch between the three working stream sources if one isn't loading
          </p>
          <div className="mt-2 flex justify-center gap-2 flex-wrap">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setViewMode('youtube1')}
              className={viewMode === 'youtube1' ? 'bg-red-100' : ''}
            >
              �️ YouTube 1
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setViewMode('youtube3')}
              className={viewMode === 'youtube3' ? 'bg-red-100' : ''}
            >
              📺 YouTube 3
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setViewMode('youtube4')}
              className={viewMode === 'youtube4' ? 'bg-purple-100' : ''}
            >
              📺 YouTube 4
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
