import { useState, useEffect } from 'react';
import { YahrzeitEntry, YahrzeitFormData } from '@/types/yahrzeit';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export function useYahrzeit() {
  const [entries, setEntries] = useState<YahrzeitEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchEntries = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'yahrzeit_entries'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as YahrzeitEntry)));
    } catch (err) {
      setError('Failed to fetch entries');
    }
    setLoading(false);
  };

  const createEntry = async (formData: YahrzeitFormData) => {
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'yahrzeit_entries'), { ...formData, userId: user.uid });
      await fetchEntries();
    } catch (err) {
      setError('Failed to create entry');
    }
    setLoading(false);
  };

  const updateEntry = async (id: string, formData: Partial<YahrzeitFormData>) => {
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'yahrzeit_entries', id), formData);
      await fetchEntries();
    } catch (err) {
      setError('Failed to update entry');
    }
    setLoading(false);
  };

  const deleteEntry = async (id: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'yahrzeit_entries', id));
      await fetchEntries();
    } catch (err) {
      setError('Failed to delete entry');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries
  };
}
