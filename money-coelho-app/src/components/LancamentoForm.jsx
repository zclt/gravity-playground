import { useState } from 'react';
import toast from 'react-hot-toast';
import Autocomplete from './Autocomplete';
import './LancamentoForm.css';

const hoje = () => new Date().toISOString().split('T')[0];

const formatarMoeda = (valor) => {
  const num = parseFloat(valor.replace(/\D/g, '')) / 100;
  return isNaN(num) ? '' : num.toFixed(2);
};

export default function LancamentoForm({ categorias, onSalvar, onCriarCategoria, onFechar }) {
  const [tipo, setTipo] = useState('saida');
  const [valorRaw, setValorRaw] = useState('');
  const [data, setData] = useState(hoje());
  const [descricao, setDescricao] = useState('');
  const [categIds, setCategIds] = useState([]);
  const [salvando, setSalvando] = useState(false);

  const handleValorChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setValorRaw(raw);
  };

  const valorFormatado = () => {
    if (!valorRaw) return '';
    const num = parseInt(valorRaw) / 100;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valorRaw || valorRaw === '0') {
      toast.error('Informe um valor válido');
      return;
    }
    if (!data) {
      toast.error('Informe a data');
      return;
    }

    setSalvando(true);
    try {
      await onSalvar({
        tipo,
        valor: parseInt(valorRaw) / 100,
        data,
        descricao: descricao.trim(),
        categorias: categIds,
      });
      toast.success(`Lançamento de ${tipo === 'entrada' ? 'entrada' : 'saída'} registrado!`);
      onFechar();
    } catch {
      toast.error('Erro ao salvar lançamento');
    } finally {
      setSalvando(false);
    }
  };

  const handleSelect = (cat) => {
    if (!categIds.includes(cat.id)) {
      setCategIds((prev) => [...prev, cat.id]);
    }
  };

  const handleRemove = (id) => {
    setCategIds((prev) => prev.filter((cid) => cid !== id));
  };

  const handleCriar = async (nome) => {
    const nova = await onCriarCategoria(nome);
    if (nova) {
      toast.success(`Categoria "${nome}" criada!`);
    }
    return nova;
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal lancamento-modal">
        <div className="modal-header">
          <h2>Novo Lançamento</h2>
          <button className="btn-icon" onClick={onFechar} aria-label="Fechar">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tipo */}
          <div className="form-group">
            <label>Tipo</label>
            <div className="toggle-group">
              <div
                className={`toggle-option ${tipo === 'entrada' ? 'active-entrada' : ''}`}
                onClick={() => setTipo('entrada')}
                role="button"
              >
                ↑ Entrada
              </div>
              <div
                className={`toggle-option ${tipo === 'saida' ? 'active-saida' : ''}`}
                onClick={() => setTipo('saida')}
                role="button"
              >
                ↓ Saída
              </div>
            </div>
          </div>

          {/* Valor */}
          <div className="form-group">
            <label>Valor (R$)</label>
            <div className="valor-input-wrap">
              <span className="valor-prefix">R$</span>
              <input
                type="text"
                inputMode="numeric"
                value={valorFormatado()}
                onChange={handleValorChange}
                placeholder="0,00"
                className="valor-input"
                autoFocus
              />
            </div>
          </div>

          {/* Data */}
          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>

          {/* Descrição */}
          <div className="form-group">
            <label>Descrição <span className="optional">(opcional)</span></label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Almoço no restaurante"
              maxLength={120}
            />
          </div>

          {/* Categorias */}
          <div className="form-group">
            <label>Categorias <span className="optional">(opcional)</span></label>
            <Autocomplete
              sugestoes={categorias}
              selecionadas={categIds}
              onSelect={handleSelect}
              onRemove={handleRemove}
              onCreate={handleCriar}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onFechar}>
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${tipo === 'entrada' ? 'btn-entrada' : ''}`}
              disabled={salvando}
            >
              {salvando ? 'Salvando…' : '💾 Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
