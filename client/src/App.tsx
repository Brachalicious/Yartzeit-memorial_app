import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { YahrzeitPage } from '@/pages/YahrzeitPage';
import { ManageEntriesPage } from '@/pages/ManageEntriesPage';
import { LettersPage } from '@/pages/LettersPage';
import { Navigation } from '@/components/Navigation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/yahrzeit" replace />} />
            <Route path="/yahrzeit" element={<YahrzeitPage />} />
            <Route path="/manage" element={<ManageEntriesPage />} />
            <Route path="/letters" element={<LettersPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
