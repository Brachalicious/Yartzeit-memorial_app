import { useState, useEffect } from 'react';
import { ShmirasHalashonEntry, ShmirasHalashonFormData, ShmirasHalashonStats } from '@/types/shmiras-halashon';

export function useShmirasHalashon() {
  const [entries, setEntries] = useState<ShmirasHalashonEntry[]>([]);
  const [stats, setStats] = useState<ShmirasHalashonStats | null>(null);
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
      console.log('Fetching Shmiras HaLashon entries...');
      const response = await fetchWithRetry('/api/shmiras-halashon');
      const data = await response.json();
      console.log('Fetched entries:', data);
      setEntries(data);
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch entries');
    }
  };

  const fetchStats = async () => {
    try {
      console.log('Fetching Shmiras HaLashon stats...');
      const response = await fetchWithRetry('/api/shmiras-halashon/stats');
      const data = await response.json();
      console.log('Fetched stats:', data);
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  };

  const getEntryByDate = async (date: string): Promise<ShmirasHalashonEntry | null> => {
    try {
      console.log('Fetching entry for date:', date);
      const response = await fetchWithRetry(`/api/shmiras-halashon/date/${date}`);
      const data = await response.json();
      console.log('Found entry for date:', data);
      return data;
    } catch (err) {
      console.log('No entry found for date:', date);
      return null;
    }
  };

  const createEntry = async (formData: ShmirasHalashonFormData) => {
    try {
      console.log('Creating Shmiras HaLashon entry:', formData);
      const response = await fetchWithRetry('/api/shmiras-halashon', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      await fetchEntries();
      await fetchStats();
      console.log('Entry created successfully');
    } catch (err) {
      console.error('Error creating entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to create entry');
      throw err;
    }
  };

  const updateEntry = async (id: number, formData: Partial<ShmirasHalashonFormData>) => {
    try {
      console.log('Updating Shmiras HaLashon entry:', id, formData);
      const response = await fetchWithRetry(`/api/shmiras-halashon/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      
      await fetchEntries();
      await fetchStats();
      console.log('Entry updated successfully');
    } catch (err) {
      console.error('Error updating entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to update entry');
      throw err;
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      console.log('Deleting Shmiras HaLashon entry:', id);
      const response = await fetchWithRetry(`/api/shmiras-halashon/${id}`, {
        method: 'DELETE',
      });
      
      await fetchEntries();
      await fetchStats();
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
      await Promise.all([fetchEntries(), fetchStats()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  return {
    entries,
    stats,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntryByDate,
    refetch: () => Promise.all([fetchEntries(), fetchStats()])
  };
}
