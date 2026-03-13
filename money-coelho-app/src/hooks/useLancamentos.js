import { useState, useEffect, useCallback } from 'react';
import { getLancamentos, createLancamento, updateLancamento, deleteLancamento } from '../api';

export function useLancamentos() {
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const data = await getLancamentos();
    // mais recentes primeiro
    setLancamentos(data.sort((a, b) => new Date(b.data) - new Date(a.data)));
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const criar = useCallback(async (data) => {
    const novo = await createLancamento(data);
    setLancamentos((prev) => [novo, ...prev].sort((a, b) => new Date(b.data) - new Date(a.data)));
    return novo;
  }, []);

  const atualizar = useCallback(async (id, data) => {
    const atualizado = await updateLancamento(id, data);
    setLancamentos((prev) =>
      prev.map((l) => (l.id === id ? atualizado : l))
    );
    return atualizado;
  }, []);

  const remover = useCallback(async (id) => {
    await deleteLancamento(id);
    setLancamentos((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { lancamentos, loading, criar, atualizar, remover, refresh: fetchAll };
}
