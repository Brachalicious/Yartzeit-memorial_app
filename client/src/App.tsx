import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { GlobalMusicPlayer } from '@/components/GlobalMusicPlayer';
import { MusicProvider } from '@/contexts/MusicContext';
import LoginPage from '@/pages/LoginPage';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Lazy load pages for better performance
const YahrzeitPage = React.lazy(() => import('@/pages/YahrzeitPage').then(m => ({ default: m.YahrzeitPage })));
const ManageEntriesPage = React.lazy(() => import('@/pages/ManageEntriesPage').then(m => ({ default: m.ManageEntriesPage })));
const LettersPage = React.lazy(() => import('@/pages/LettersPage').then(m => ({ default: m.LettersPage })));
const UploadMemoryPage = React.lazy(() => import('@/pages/UploadMemoryPage').then(m => ({ default: m.UploadMemoryPage })));
const CandlePage = React.lazy(() => import('@/pages/CandlePage').then(m => ({ default: m.CandlePage })));
const ChatPage = React.lazy(() => import('@/pages/ChatPage').then(m => ({ default: m.ChatPage })));
const LearningPage = React.lazy(() => import('@/pages/LearningPage').then(m => ({ default: m.LearningPage })));
const KotelLivePage = React.lazy(() => import('@/pages/KotelLivePage').then(m => ({ default: m.KotelLivePage })));
const ResourcesPage = React.lazy(() => import('@/pages/ResourcesPage').then(m => ({ default: m.ResourcesPage })));
const MemorialPage = React.lazy(() =>
  import('@/pages/MemorialPage').then((m) => ({ default: m.MemorialPage }))
);
const CrisisManagementPage = React.lazy(() => import('@/pages/CrisisManagementPage').then(m => ({ default: m.default })));
const SignUpPage = React.lazy(() => import('@/pages/SignUpPage').then(m => ({ default: m.default })));


function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isKotelLivePage = location.pathname === '/kotel-live';
  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Show login page unless logged in
  if (!loggedIn && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-foreground"
      style={{ backgroundImage: "url('/Kotel.png')" }}
    >
      <Navigation />
      
      {/* Mystic Minded Logo - appears on every page */}
      <div className="flex justify-center pt-4 pb-2">
        <img 
          src="/mysticminded-logo no backround copy.png" 
          alt="Mystic Minded" 
          className="h-16 md:h-20 lg:h-24 object-contain opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>
      
      {/* Memorial Dedication - appears on every page */}
      <div className="flex justify-center pb-4">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 bg-clip-text text-transparent text-center">
          לעילוי נשמת חיה שרה לאה בת אורי זצ״ל
        </h2>
      </div>
      
      <main className={`main-content w-full px-2 sm:px-4 md:px-6 py-6 sm:py-8 mx-auto ${isKotelLivePage ? '' : 'max-w-5xl bg-white/90 rounded-lg shadow-lg backdrop-blur-md'}`}>
        <React.Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/crisis" element={<CrisisManagementPage />} />
            <Route path="/" element={<Navigate to="/yahrzeit" replace />} />
            <Route path="/yahrzeit" element={<YahrzeitPage />} />
            <Route path="/manage" element={<ManageEntriesPage />} />
            <Route path="/candle" element={<CandlePage />} />
            <Route path="/letters" element={<LettersPage />} />
            <Route path="/upload-memory" element={<UploadMemoryPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/kotel-live" element={<KotelLivePage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/memorial" element={<MemorialPage />} />
          </Routes>
        </React.Suspense>
      </main>

      {/* Global Background Music Player */}
      <GlobalMusicPlayer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <MusicProvider>
        <AppContent />
      </MusicProvider>
    </Router>
  );
}

export default App;
