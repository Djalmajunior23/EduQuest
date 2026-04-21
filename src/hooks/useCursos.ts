import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

export function useCursos() {
  const { profile } = useAuth();
  const tenantId = profile?.tenantId;
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) return;

    const q = query(collection(db, 'cursos'), where('tenantId', '==', tenantId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCursos(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tenantId]);

  return { cursos, loading };
}
