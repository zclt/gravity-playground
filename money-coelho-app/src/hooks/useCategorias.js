import { useState, useEffect, useCallback } from 'react';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../api';

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const data = await getCategorias();
    setCategorias(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const criar = useCallback(async (data) => {
    const nova = await createCategoria(data);
    setCategorias((prev) => [...prev, nova]);
    return nova;
  }, []);

  const atualizar = useCallback(async (id, data) => {
    const atualizada = await updateCategoria(id, data);
    setCategorias((prev) =>
      prev.map((c) => (c.id === id ? atualizada : c))
    );
    return atualizada;
  }, []);

  const remover = useCallback(async (id) => {
    await deleteCategoria(id);
    setCategorias((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Cria categoria automaticamente se não existir (usado no autocomplete)
  const criarSeNaoExistir = useCallback(async (nome) => {
    const existente = categorias.find(
      (c) => c.nome.toLowerCase() === nome.toLowerCase()
    );
    if (existente) return existente;

    // Cor padrão aleatória para auto-cadastro
    const coresPadrao = ['#e63946', '#f4a261', '#2d9e6b', '#457b9d', '#6a4c93', '#f3722c'];
    const cor = coresPadrao[Math.floor(Math.random() * coresPadrao.length)];
    return await criar({ nome, cor, icone: '🏷️' });
  }, [categorias, criar]);

  return { categorias, loading, criar, atualizar, remover, criarSeNaoExistir, refresh: fetchAll };
}
