import { useState, useEffect } from 'react';
import { Letter, LetterFormData } from '@/types/letters';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

export function useLetters() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchLetters = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'letters'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      setLetters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Letter)));
      setError(null);
    } catch (err) {
      setError('Failed to fetch letters');
    }
    setLoading(false);
  };

  const createLetter = async (formData: LetterFormData) => {
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'letters'), { ...formData, userId: user.uid });
      await fetchLetters();
    } catch (err) {
      setError('Failed to save letter');
      throw err;
    }
    setLoading(false);
  };

  const deleteLetter = async (id: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'letters', id));
      await fetchLetters();
    } catch (err) {
      setError('Failed to delete letter');
      throw err;
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLetters();
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
