import { useState, useEffect } from 'react';
import { TehillimChapter, TehillimChapterFormData, TehillimProgress } from '@/types/tehillim';

export function useTehillim() {
  const [chapters, setChapters] = useState<TehillimChapter[]>([]);
  const [progress, setProgress] = useState<TehillimProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChapters = async () => {
    try {
      console.log('Fetching Tehillim chapters...');
      const response = await fetch('/api/tehillim');
      if (!response.ok) {
        throw new Error('Failed to fetch Tehillim chapters');
      }
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
      const response = await fetch('/api/tehillim/progress');
      if (!response.ok) {
        throw new Error('Failed to fetch Tehillim progress');
      }
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
      const response = await fetch('/api/tehillim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save Tehillim chapter');
      }
      
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
      const response = await fetch(`/api/tehillim/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete Tehillim chapter');
      }
      
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
