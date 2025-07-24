import { useState, useEffect } from 'react';
import { Letter, LetterFormData } from '@/types/letters';

export function useLetters() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLetters = async () => {
    try {
      console.log('Fetching letters...');
      const response = await fetch('/api/letters');
      if (!response.ok) {
        throw new Error('Failed to fetch letters');
      }
      const data = await response.json();
      console.log('Fetched letters:', data);
      setLetters(data);
    } catch (err) {
      console.error('Error fetching letters:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch letters');
    }
  };

  const createLetter = async (formData: LetterFormData) => {
    try {
      console.log('Creating letter:', formData);
      const response = await fetch('/api/letters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save letter');
      }
      
      await fetchLetters();
      console.log('Letter saved successfully');
    } catch (err) {
      console.error('Error creating letter:', err);
      setError(err instanceof Error ? err.message : 'Failed to save letter');
      throw err;
    }
  };

  const deleteLetter = async (id: number) => {
    try {
      console.log('Deleting letter:', id);
      const response = await fetch(`/api/letters/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete letter');
      }
      
      await fetchLetters();
      console.log('Letter deleted successfully');
    } catch (err) {
      console.error('Error deleting letter:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete letter');
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchLetters();
      setLoading(false);
    };
    
    loadData();
  }, []);

  return {
    letters,
    loading,
    error,
    createLetter,
    deleteLetter,
    refetch: fetchLetters
  };
}
