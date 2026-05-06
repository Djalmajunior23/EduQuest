import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export function useCursos() {
  const { profile } = useAuth();
  const tenantId = profile?.tenantId;
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) return;

    const fetchCursos = async () => {
      const { data, error } = await supabase
        .from('cursos')
        .select('*')
        .eq('tenant_id', tenantId);
      
      if (!error && data) {
        setCursos(data);
      }
      setLoading(false);
    };

    fetchCursos();

    const channel = supabase
      .channel('cursos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cursos',
          filter: `tenant_id=eq.${tenantId}`,
        },
        () => {
          fetchCursos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenantId]);

  return { cursos, loading };
}
