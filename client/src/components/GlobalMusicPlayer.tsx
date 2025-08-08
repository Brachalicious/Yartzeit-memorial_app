import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useMusic } from '@/contexts/MusicContext';

export function GlobalMusicPlayer() {
  const { currentSong, setCurrentSong } = useMusic();
  const [backgroundMusicPlaying, setBackgroundMusicPlaying] = React.useState(false);
  const [showFallback, setShowFallback] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  // Check if background music should be playing
  React.useEffect(() => {
    setBackgroundMusicPlaying(currentSong === 'background');
  }, [currentSong]);

  const handleBackgroundMusicToggle = (playing: boolean) => {
    setBackgroundMusicPlaying(playing);
    if (playing) {
      setCurrentSong('background');
      // Add a small delay to ensure iframe is rendered
      setTimeout(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          try {
            // Try to communicate with YouTube iframe to ensure it's playing
            iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
          } catch (e) {
            console.log('YouTube iframe communication not available, relying on autoplay');
          }
        }
      }, 500);
    } else {
      setCurrentSong(null);
      if (iframeRef.current && iframeRef.current.contentWindow) {
        try {
          iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        } catch (e) {
          console.log('YouTube iframe communication not available for pause');
        }
      }
    }
  };

  const toggleFallbackMode = () => {
    setShowFallback(!showFallback);
  };

  return (
    <>
      {/* Global Background Music Player - Small Circle */}
      {backgroundMusicPlaying && currentSong === 'background' && (
        <div className="music-player-fixed">
          <div className="relative">
            <Button
              onClick={() => handleBackgroundMusicToggle(false)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg border-2 border-white flex items-center justify-center transition-all duration-300 hover:scale-105"
              title="Playing: Nachem by Yehudah - Click to stop"
            >
              <div className="flex flex-col items-center">
                <span className="text-lg">🎵</span>
                <span className="text-xs">⏹️</span>
              </div>
            </Button>
            {/* Animated playing indicator */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-400 opacity-20 animate-ping"></div>
            <div className="music-tooltip absolute -top-12 -left-4 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              🎵 Playing: Nachem - Yehudah
              <br />
              <span className="text-green-300">Click to stop</span>
            </div>
            {!showFallback && (
              <button
                onClick={toggleFallbackMode}
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800/80 text-white px-2 py-1 rounded opacity-60 hover:opacity-100 transition-opacity"
                title="Switch to fallback player if music doesn't work"
              >
                🔧
              </button>
            )}
          </div>
          <iframe
            ref={iframeRef}
            width="560"
            height="315"
            src="https://www.youtube.com/embed/UocjCboUMuQ?autoplay=1&mute=0&loop=1&playlist=UocjCboUMuQ&rel=0&modestbranding=1&iv_load_policy=3&controls=0&start=0&enablejsapi=1"
            title="Nachem - Yehudah"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            style={{ display: 'none', position: 'absolute', top: '-9999px', left: '-9999px' }}
          />
        </div>
      )}

      {/* Fallback Mode - Direct Link */}
      {showFallback && (
        <div className="music-player-fixed">
          <div className="relative">
            <Button
              onClick={() => window.open('https://www.youtube.com/watch?v=UocjCboUMuQ', '_blank')}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg border-2 border-white flex items-center justify-center transition-all duration-300 hover:scale-105"
              title="Open Nachem by Yehudah in YouTube"
            >
              <div className="flex flex-col items-center">
                <span className="text-lg">🎵</span>
                <span className="text-xs">🔗</span>
              </div>
            </Button>
            <div className="music-tooltip absolute -top-12 -left-8 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              🎵 Open: Nachem - Yehudah
              <br />
              <span className="text-pink-300">Opens in YouTube</span>
            </div>
            <button
              onClick={toggleFallbackMode}
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800/80 text-white px-2 py-1 rounded opacity-60 hover:opacity-100 transition-opacity"
              title="Switch back to embedded player"
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* Restore Background Music Button */}
      {!backgroundMusicPlaying && (currentSong === null || currentSong === 'background') && (
        <div className="music-player-fixed">
          <div className="relative">
            <Button
              onClick={() => handleBackgroundMusicToggle(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg border-2 border-white flex items-center justify-center transition-all duration-300 hover:scale-105"
              title="Play Nachem by Yehudah - Background Music"
            >
              <div className="flex flex-col items-center">
                <span className="text-lg">🎵</span>
                <span className="text-xs">▶️</span>
              </div>
            </Button>
            {/* Subtle pulse animation to draw attention */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-blue-500 opacity-30 animate-pulse"></div>
            <div className="music-tooltip absolute -top-12 -left-4 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              🎵 Play: Nachem - Yehudah
              <br />
              <span className="text-green-300">Background music for the memorial</span>
            </div>
            {!showFallback && (
              <button
                onClick={toggleFallbackMode}
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800/80 text-white px-2 py-1 rounded opacity-60 hover:opacity-100 transition-opacity"
                title="Switch to fallback player if music doesn't work"
              >
                🔧
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
