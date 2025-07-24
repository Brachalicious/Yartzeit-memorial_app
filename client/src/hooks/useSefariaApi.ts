import { useState } from 'react';

export function useSefariaApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWithRetry = async (url: string, options?: RequestInit) => {
    let attempt = 0;
    const maxAttempts = 3;
    
    while (attempt < maxAttempts) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
        return response;
      } catch (networkError) {
        attempt++;
        console.warn(`Network attempt ${attempt} failed for ${url}:`, networkError);
        if (attempt >= maxAttempts) {
          throw new Error('Network connection failed. Please check your internet connection and try again.');
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    throw new Error('Maximum retry attempts reached');
  };

  const getChapterInfo = async (chapterNumber: number) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching chapter info for Tehillim ${chapterNumber}`);
      const response = await fetchWithRetry(`/api/tehillim/chapter/${chapterNumber}/info`);
      
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

  const getSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching Tehillim suggestions');
      const response = await fetchWithRetry('/api/tehillim/suggestions');
      
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
