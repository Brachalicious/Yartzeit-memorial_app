import { useState, useEffect } from 'react';
import { LearningActivity, LearningActivityFormData } from '@/types/learning';

export function useLearning() {
  const [activities, setActivities] = useState<LearningActivity[]>([]);
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

  const fetchActivities = async () => {
    try {
      console.log('Fetching learning activities...');
      const response = await fetchWithRetry('/api/learning');
      const data = await response.json();
      console.log('Fetched activities:', data);
      setActivities(data);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    }
  };

  const createActivity = async (formData: LearningActivityFormData) => {
    try {
      console.log('Creating learning activity:', formData);
      const response = await fetchWithRetry('/api/learning', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      await fetchActivities();
      console.log('Activity saved successfully');
    } catch (err) {
      console.error('Error creating activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to save activity');
      throw err;
    }
  };

  const deleteActivity = async (id: number) => {
    try {
      console.log('Deleting learning activity:', id);
      const response = await fetchWithRetry(`/api/learning/${id}`, {
        method: 'DELETE',
      });
      
      await fetchActivities();
      console.log('Activity deleted successfully');
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete activity');
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await fetchActivities();
      setLoading(false);
    };
    
    loadData();
  }, []);

  return {
    activities,
    loading,
    error,
    createActivity,
    deleteActivity,
    refetch: fetchActivities
  };
}
