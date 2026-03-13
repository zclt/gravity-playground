import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './CategoriaForm.css';

const CORES = [
  '#e63946', '#f4a261', '#2d9e6b', '#457b9d',
  '#6a4c93', '#f3722c', '#43aa8b', '#277da1',
  '#f8961e', '#90be6d', '#577590', '#c77dff',
];

const ICONES = [
  '🍔','🚗','💊','🎮','🏠','💼','📈','🎓',
  '✈️','👗','🐾','📱','💡','🎵','🏋️','🛒',
  '🌱','☕','📚','🎁','🔧','🎨','💰','🏷️',
];

export default function CategoriaForm({ categoriaInicial, onSalvar, onFechar }) {
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('#e63946');
  const [icone, setIcone] = useState('🏷️');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (categoriaInicial) {
      setNome(categoriaInicial.nome || '');
      setCor(categoriaInicial.cor || '#e63946');
      setIcone(categoriaInicial.icone || '🏷️');
    }
  }, [categoriaInicial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error('Informe o nome da categoria');
      return;
    }
    setSalvando(true);
    try {
      await onSalvar({ nome: nome.trim(), cor, icone });
    } catch {
      toast.error('Erro ao salvar categoria');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal categoria-modal">
        <div className="modal-header">
          <h2>{categoriaInicial ? 'Editar Categoria' : 'Nova Categoria'}</h2>
          <button className="btn-icon" onClick={onFechar} aria-label="Fechar">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Preview */}
          <div className="categoria-preview">
            <div className="preview-icon-wrap" style={{ background: cor + '22' }}>
              <span>{icone}</span>
            </div>
            <div className="preview-text" style={{ color: cor }}>
              {nome || 'Nome da categoria'}
            </div>
          </div>

          {/* Nome */}
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Alimentação"
              autoFocus
              maxLength={40}
            />
          </div>

          {/* Ícone */}
          <div className="form-group">
            <label>Ícone</label>
            <div className="icones-grid">
              {ICONES.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  className={`icone-btn ${icone === ic ? 'icone-ativo' : ''}`}
                  onClick={() => setIcone(ic)}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Cor */}
          <div className="form-group">
            <label>Cor</label>
            <div className="cores-grid">
              {CORES.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`cor-btn ${cor === c ? 'cor-ativa' : ''}`}
                  style={{ background: c }}
                  onClick={() => setCor(c)}
                  title={c}
                />
              ))}
              <input
                type="color"
                value={cor}
                onChange={(e) => setCor(e.target.value)}
                className="cor-custom-input"
                title="Cor personalizada"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onFechar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={salvando}>
              {salvando ? 'Salvando…' : '💾 Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
