import { useState, useEffect } from 'react';
import { YahrzeitEntry, UpcomingYahrzeit, YahrzeitFormData } from '@/types/yahrzeit';

export function useYahrzeit() {
  const [entries, setEntries] = useState<YahrzeitEntry[]>([]);
  const [upcomingYahrzeits, setUpcomingYahrzeits] = useState<UpcomingYahrzeit[]>([]);
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

  const fetchEntries = async () => {
    try {
      console.log('Fetching yahrzeit entries...');
      const response = await fetchWithRetry('/api/yahrzeit');
      const data = await response.json();
      console.log('Fetched entries:', data);
      setEntries(data);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch entries');
    }
  };

  const fetchUpcomingYahrzeits = async () => {
    try {
      console.log('Fetching upcoming yahrzeits...');
      const response = await fetchWithRetry('/api/yahrzeit/upcoming');
      const data = await response.json();
      console.log('Fetched upcoming yahrzeits:', data);
      setUpcomingYahrzeits(data);
    } catch (err) {
      console.error('Error fetching upcoming yahrzeits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch upcoming yahrzeits');
    }
  };

  const createEntry = async (formData: YahrzeitFormData) => {
    try {
      console.log('Creating yahrzeit entry:', formData);
      const response = await fetchWithRetry('/api/yahrzeit', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      await fetchEntries();
      await fetchUpcomingYahrzeits();
      console.log('Entry created successfully');
    } catch (err) {
      console.error('Error creating entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to create entry');
      throw err;
    }
  };

  const updateEntry = async (id: number, formData: Partial<YahrzeitFormData>) => {
    try {
      console.log('Updating yahrzeit entry:', id, formData);
      const response = await fetchWithRetry(`/api/yahrzeit/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      
      await fetchEntries();
      await fetchUpcomingYahrzeits();
      console.log('Entry updated successfully');
    } catch (err) {
      console.error('Error updating entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to update entry');
      throw err;
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      console.log('Deleting yahrzeit entry:', id);
      const response = await fetchWithRetry(`/api/yahrzeit/${id}`, {
        method: 'DELETE',
      });
      
      await fetchEntries();
      await fetchUpcomingYahrzeits();
      console.log('Entry deleted successfully');
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete entry');
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchEntries(), fetchUpcomingYahrzeits()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  return {
    entries,
    upcomingYahrzeits,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch: () => Promise.all([fetchEntries(), fetchUpcomingYahrzeits()])
  };
}
