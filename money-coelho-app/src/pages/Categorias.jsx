import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCategorias } from '../hooks/useCategorias';
import CategoriaForm from '../components/CategoriaForm';
import './Categorias.css';

export default function Categorias() {
  const { categorias, loading, criar, atualizar, remover } = useCategorias();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);

  const handleSalvar = async (dados) => {
    if (editando) {
      await atualizar(editando.id, dados);
      toast.success('Categoria atualizada!');
    } else {
      await criar(dados);
      toast.success(`Categoria "${dados.nome}" criada!`);
    }
    setMostrarForm(false);
    setEditando(null);
  };

  const handleEditar = (cat) => {
    setEditando(cat);
    setMostrarForm(true);
  };

  const handleRemover = async (id, nome) => {
    if (!confirm(`Remover a categoria "${nome}"?`)) return;
    await remover(id);
    toast.success('Categoria removida');
  };

  return (
    <div>
      <div className="page-header">
        <h1>Categorias</h1>
        <button className="btn btn-primary" onClick={() => { setEditando(null); setMostrarForm(true); }}>
          + Nova Categoria
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <span className="spinner" />
          <span>Carregando…</span>
        </div>
      ) : categorias.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🏷️</span>
          <p>Nenhuma categoria cadastrada</p>
          <button className="btn btn-primary" onClick={() => setMostrarForm(true)}>
            Criar Categoria
          </button>
        </div>
      ) : (
        <div className="categorias-grid">
          {categorias.map((cat) => (
            <div
              key={cat.id}
              className="categoria-card"
              style={{ borderLeftColor: cat.cor }}
            >
              <div className="categoria-icon-wrap" style={{ background: cat.cor + '22' }}>
                <span className="categoria-icon">{cat.icone}</span>
              </div>
              <div className="categoria-info">
                <span className="categoria-nome">{cat.nome}</span>
                <span className="categoria-cor-label" style={{ color: cat.cor }}>
                  ● {cat.cor}
                </span>
              </div>
              <div className="categoria-actions">
                <button
                  className="btn-icon"
                  onClick={() => handleEditar(cat)}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon btn-danger-subtle"
                  onClick={() => handleRemover(cat.id, cat.nome)}
                  title="Remover"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mostrarForm && (
        <CategoriaForm
          categoriaInicial={editando}
          onSalvar={handleSalvar}
          onFechar={() => { setMostrarForm(false); setEditando(null); }}
        />
      )}
    </div>
  );
}
