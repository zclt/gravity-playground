import { useState, useRef, useEffect } from 'react';
import './Autocomplete.css';

/**
 * Autocomplete genérico com suporte a multi-seleção e auto-criação.
 * Props:
 *  - sugestoes: array de categorias { id, nome, cor, icone }
 *  - selecionadas: array de ids selecionadas
 *  - onSelect(categoriaObj) — chamado ao selecionar/criar
 *  - onRemove(id) — chamado ao remover tag
 *  - onCreate(nome) — chamado quando não há sugestão e usuário confirma criação
 */
export default function Autocomplete({ sugestoes = [], selecionadas = [], onSelect, onRemove, onCreate }) {
  const [query, setQuery] = useState('');
  const [aberto, setAberto] = useState(false);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  const filtradas = sugestoes.filter(
    (s) =>
      s.nome.toLowerCase().includes(query.toLowerCase()) &&
      !selecionadas.includes(s.id)
  );

  const mostrarCriar = query.trim() && filtradas.length === 0;

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setAberto(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (cat) => {
    onSelect(cat);
    setQuery('');
    setAberto(false);
    inputRef.current?.focus();
  };

  const handleCriar = async () => {
    const nome = query.trim();
    if (!nome) return;
    const nova = await onCreate(nome);
    if (nova) {
      onSelect(nova);
    }
    setQuery('');
    setAberto(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filtradas.length > 0) handleSelect(filtradas[0]);
      else if (mostrarCriar) handleCriar();
    }
    if (e.key === 'Backspace' && !query && selecionadas.length > 0) {
      onRemove(selecionadas[selecionadas.length - 1]);
    }
  };

  const categselecionadas = sugestoes.filter((s) => selecionadas.includes(s.id));

  return (
    <div className="autocomplete-wrap" ref={wrapRef}>
      <div
        className={`autocomplete-input-box ${aberto ? 'focused' : ''}`}
        onClick={() => { inputRef.current?.focus(); setAberto(true); }}
      >
        <div className="autocomplete-tags">
          {categselecionadas.map((cat) => (
            <span
              key={cat.id}
              className="autocomplete-tag"
              style={{ background: cat.cor + '22', borderColor: cat.cor + '55', color: cat.cor }}
            >
              <span>{cat.icone}</span>
              <span>{cat.nome}</span>
              <button
                type="button"
                className="autocomplete-tag-remove"
                onClick={(e) => { e.stopPropagation(); onRemove(cat.id); }}
                aria-label="Remover"
              >
                ×
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setAberto(true); }}
            onFocus={() => setAberto(true)}
            onKeyDown={handleKeyDown}
            placeholder={categselecionadas.length === 0 ? 'Buscar ou criar categoria…' : ''}
            className="autocomplete-text-input"
          />
        </div>
      </div>

      {aberto && (filtradas.length > 0 || mostrarCriar) && (
        <div className="autocomplete-dropdown">
          {filtradas.map((cat) => (
            <button
              type="button"
              key={cat.id}
              className="autocomplete-item"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(cat)}
            >
              <span
                className="autocomplete-item-dot"
                style={{ background: cat.cor }}
              />
              <span className="autocomplete-item-icon">{cat.icone}</span>
              <span className="autocomplete-item-nome">{cat.nome}</span>
            </button>
          ))}
          {mostrarCriar && (
            <button
              type="button"
              className="autocomplete-item autocomplete-criar"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleCriar}
            >
              <span>✨</span>
              <span>Criar categoria "<strong>{query.trim()}</strong>"</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
