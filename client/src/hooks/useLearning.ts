import { useState, useEffect } from 'react';
import { LearningActivity, LearningActivityFormData } from '@/types/learning';

export function useLearning() {
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      console.log('Fetching learning activities...');
      const response = await fetch('/api/learning');
      if (!response.ok) {
        throw new Error('Failed to fetch learning activities');
      }
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
      const response = await fetch('/api/learning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save learning activity');
      }
      
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
      const response = await fetch(`/api/learning/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete learning activity');
      }
      
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
