import { useState, useEffect } from 'react';
import { TehillimChapter, TehillimChapterFormData, TehillimProgress } from '@/types/tehillim';

export function useTehillim() {
  const [chapters, setChapters] = useState<TehillimChapter[]>([]);
  const [progress, setProgress] = useState<TehillimProgress | null>(null);
  const [loading, setLoading] = useState(true);
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

  const fetchChapters = async () => {
    try {
      console.log('Fetching Tehillim chapters...');
      const response = await fetchWithRetry('/api/tehillim');
      const data = await response.json();
      console.log('Fetched chapters:', data);
      setChapters(data);
    } catch (err) {
      console.error('Error fetching chapters:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch chapters');
    }
  };

  const fetchProgress = async () => {
    try {
      console.log('Fetching Tehillim progress...');
      const response = await fetchWithRetry('/api/tehillim/progress');
      const data = await response.json();
      console.log('Fetched progress:', data);
      setProgress(data);
    } catch (err) {
      console.error('Error fetching progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch progress');
    }
  };

  const createChapter = async (formData: TehillimChapterFormData) => {
    try {
      console.log('Creating Tehillim chapter:', formData);
      const response = await fetchWithRetry('/api/tehillim', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      await fetchChapters();
      await fetchProgress();
      console.log('Chapter saved successfully');
    } catch (err) {
      console.error('Error creating chapter:', err);
      setError(err instanceof Error ? err.message : 'Failed to save chapter');
      throw err;
    }
  };

  const deleteChapter = async (id: number) => {
    try {
      console.log('Deleting Tehillim chapter:', id);
      const response = await fetchWithRetry(`/api/tehillim/${id}`, {
        method: 'DELETE',
      });
      
      await fetchChapters();
      await fetchProgress();
      console.log('Chapter deleted successfully');
    } catch (err) {
      console.error('Error deleting chapter:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete chapter');
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchChapters(), fetchProgress()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  return {
    chapters,
    progress,
    loading,
    error,
    createChapter,
    deleteChapter,
    refetch: () => Promise.all([fetchChapters(), fetchProgress()])
  };
}
