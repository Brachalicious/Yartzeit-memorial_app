import { useState, useEffect } from 'react';
import { Letter, LetterFormData } from '@/types/letters';

export function useLetters() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLetters = async () => {
    try {
      console.log('Fetching letters...');
      
      // Add retry logic for network issues
      let attempt = 0;
      const maxAttempts = 3;
      let response;
      
      while (attempt < maxAttempts) {
        try {
          response = await fetch('/api/letters', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          break;
        } catch (networkError) {
          attempt++;
          console.warn(`Network attempt ${attempt} failed:`, networkError);
          if (attempt >= maxAttempts) {
            throw new Error('Network connection failed. Please check your internet connection and try again.');
          }
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
      
      if (!response) {
        throw new Error('Failed to connect to server');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Fetched letters:', data);
      setLetters(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching letters:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch letters';
      setError(errorMessage);
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
        const errorText = await response.text();
        throw new Error(`Failed to save letter: ${response.status} - ${errorText}`);
      }
      
      await fetchLetters();
      console.log('Letter saved successfully');
    } catch (err) {
      console.error('Error creating letter:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save letter';
      setError(errorMessage);
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
        const errorText = await response.text();
        throw new Error(`Failed to delete letter: ${response.status} - ${errorText}`);
      }
      
      await fetchLetters();
      console.log('Letter deleted successfully');
    } catch (err) {
      console.error('Error deleting letter:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete letter';
      setError(errorMessage);
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
