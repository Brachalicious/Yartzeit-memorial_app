import { useState, useEffect } from 'react';
import { YahrzeitEntry, UpcomingYahrzeit, YahrzeitFormData } from '@/types/yahrzeit';

export function useYahrzeit() {
  const [entries, setEntries] = useState<YahrzeitEntry[]>([]);
  const [upcomingYahrzeits, setUpcomingYahrzeits] = useState<UpcomingYahrzeit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      console.log('Fetching yahrzeit entries...');
      const response = await fetch('/api/yahrzeit');
      if (!response.ok) {
        throw new Error('Failed to fetch yahrzeit entries');
      }
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
      const response = await fetch('/api/yahrzeit/upcoming');
      if (!response.ok) {
        throw new Error('Failed to fetch upcoming yahrzeits');
      }
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
      const response = await fetch('/api/yahrzeit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create yahrzeit entry');
      }
      
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
      const response = await fetch(`/api/yahrzeit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update yahrzeit entry');
      }
      
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
      const response = await fetch(`/api/yahrzeit/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete yahrzeit entry');
      }
      
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
