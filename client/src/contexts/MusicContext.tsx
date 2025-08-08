import * as React from 'react';
import { db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';

type MusicContextType = {
  currentSong: string | null;
  setCurrentSong: (song: string | null) => void;
  stopAllMusic: () => void;
  isPlaying: (songId: string) => boolean;
};

const MusicContext = React.createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = React.useState<string | null>(null);

  const stopAllMusic = () => {
    setCurrentSong(null);
  };

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleSetCurrentSong = (song: string | null) => {
    // If a song is already playing and a new song is requested, stop the old one first
    if (currentSong && song && currentSong !== song) {
      // Small delay to ensure proper cleanup of previous player
      setTimeout(() => setCurrentSong(song), 100);
    } else {
      setCurrentSong(song);
    }

    if (user && song) {
      addDoc(collection(db, 'music_selections'), {
        userId: user.uid,
        song,
        timestamp: new Date().toISOString()
      });
    }
  };

  const isPlaying = (songId: string) => {
    return currentSong === songId;
  };

  return (
    <MusicContext.Provider value={{
      currentSong,
      setCurrentSong: handleSetCurrentSong,
      stopAllMusic,
      isPlaying
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = React.useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
