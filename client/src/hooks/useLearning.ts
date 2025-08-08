import { useState, useEffect } from 'react';
import { LearningActivity, LearningActivityFormData } from '@/types/learning';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

export function useLearning() {
  const [activities, setActivities] = useState<LearningActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchActivities = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'learning_activities'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      setActivities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LearningActivity)));
    } catch (err) {
      setError('Failed to fetch activities');
    }
    setLoading(false);
  };

  const createActivity = async (formData: LearningActivityFormData) => {
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'learning_activities'), { ...formData, userId: user.uid });
      await fetchActivities();
    } catch (err) {
      setError('Failed to save activity');
      throw err;
    }
    setLoading(false);
  };

  const deleteActivity = async (id: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'learning_activities', id));
      await fetchActivities();
    } catch (err) {
      setError('Failed to delete activity');
      throw err;
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
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
