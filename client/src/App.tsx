import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';

// Lazy load pages for better performance
const YahrzeitPage = React.lazy(() => import('@/pages/YahrzeitPage').then(m => ({ default: m.YahrzeitPage })));
const ManageEntriesPage = React.lazy(() => import('@/pages/ManageEntriesPage').then(m => ({ default: m.ManageEntriesPage })));
const LettersPage = React.lazy(() => import('@/pages/LettersPage').then(m => ({ default: m.LettersPage })));
const CandlePage = React.lazy(() => import('@/pages/CandlePage').then(m => ({ default: m.CandlePage })));
const ChatPage = React.lazy(() => import('@/pages/ChatPage').then(m => ({ default: m.ChatPage })));
const LearningPage = React.lazy(() => import('@/pages/LearningPage').then(m => ({ default: m.LearningPage })));

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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <React.Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Navigate to="/yahrzeit" replace />} />
              <Route path="/yahrzeit" element={<YahrzeitPage />} />
              <Route path="/manage" element={<ManageEntriesPage />} />
              <Route path="/candle" element={<CandlePage />} />
              <Route path="/letters" element={<LettersPage />} />
              <Route path="/learning" element={<LearningPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </React.Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
