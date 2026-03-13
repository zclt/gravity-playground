// Mock API — persiste dados no localStorage
// Chaves de armazenamento
const KEYS = {
  lancamentos: 'mca_lancamentos',
  categorias: 'mca_categorias',
};

// Helpers
const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

const write = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Simula latência mínima de API
const delay = (ms = 80) => new Promise((r) => setTimeout(r, ms));

// ─── CATEGORIAS ───────────────────────────────────────────────
export const getCategorias = async () => {
  await delay();
  return read(KEYS.categorias);
};

export const createCategoria = async (data) => {
  await delay();
  const categorias = read(KEYS.categorias);
  const nova = { id: uid(), ...data, criadaEm: new Date().toISOString() };
  write(KEYS.categorias, [...categorias, nova]);
  return nova;
};

export const updateCategoria = async (id, data) => {
  await delay();
  const categorias = read(KEYS.categorias).map((c) =>
    c.id === id ? { ...c, ...data } : c
  );
  write(KEYS.categorias, categorias);
  return categorias.find((c) => c.id === id);
};

export const deleteCategoria = async (id) => {
  await delay();
  const categorias = read(KEYS.categorias).filter((c) => c.id !== id);
  write(KEYS.categorias, categorias);
  return { ok: true };
};

// ─── LANÇAMENTOS ─────────────────────────────────────────────
export const getLancamentos = async () => {
  await delay();
  return read(KEYS.lancamentos);
};

export const createLancamento = async (data) => {
  await delay();
  const lancamentos = read(KEYS.lancamentos);
  const novo = { id: uid(), ...data, criadoEm: new Date().toISOString() };
  write(KEYS.lancamentos, [...lancamentos, novo]);
  return novo;
};

export const updateLancamento = async (id, data) => {
  await delay();
  const lancamentos = read(KEYS.lancamentos).map((l) =>
    l.id === id ? { ...l, ...data } : l
  );
  write(KEYS.lancamentos, lancamentos);
  return lancamentos.find((l) => l.id === id);
};

export const deleteLancamento = async (id) => {
  await delay();
  const lancamentos = read(KEYS.lancamentos).filter((l) => l.id !== id);
  write(KEYS.lancamentos, lancamentos);
  return { ok: true };
};

// Seed de categorias padrão (executado na primeira visita)
export const seedDefaultCategorias = async () => {
  const existing = read(KEYS.categorias);
  if (existing.length > 0) return;

  const defaults = [
    { nome: 'Alimentação', cor: '#e63946', icone: '🍔' },
    { nome: 'Transporte', cor: '#f4a261', icone: '🚗' },
    { nome: 'Saúde', cor: '#2d9e6b', icone: '💊' },
    { nome: 'Lazer', cor: '#6a4c93', icone: '🎮' },
    { nome: 'Moradia', cor: '#457b9d', icone: '🏠' },
    { nome: 'Salário', cor: '#2d9e6b', icone: '💼' },
    { nome: 'Investimentos', cor: '#1d3557', icone: '📈' },
  ];

  for (const cat of defaults) {
    await createCategoria(cat);
  }
};
