import { useState } from 'react';
import { TehillimChapterInfo, TehillimSuggestions } from '@/types/sefaria';

export function useSefariaApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getChapterInfo = async (chapterNumber: number): Promise<TehillimChapterInfo | null> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching chapter info for Tehillim ${chapterNumber}`);
      const response = await fetch(`/api/tehillim/chapter/${chapterNumber}/info`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch chapter information');
      }
      
      const data = await response.json();
      console.log('Received chapter info:', data);
      
      return data;
    } catch (err) {
      console.error('Error fetching chapter info:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch chapter info');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async (): Promise<TehillimSuggestions | null> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching Tehillim suggestions');
      const response = await fetch('/api/tehillim/suggestions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      
      const data = await response.json();
      console.log('Received suggestions:', data);
      
      return data;
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getChapterInfo,
    getSuggestions,
    loading,
    error
  };
}
