import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLancamentos } from '../hooks/useLancamentos';
import { useCategorias } from '../hooks/useCategorias';
import LancamentoForm from '../components/LancamentoForm';
import './Lancamentos.css';

const fmtMoeda = (v) =>
  v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'R$ 0,00';

const fmtData = (d) => {
  if (!d) return '-';
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR');
};

const FILTROS = ['todos', 'entrada', 'saida'];
const PERIODOS = ['todos', 'diario', 'semanal', 'mensal'];

const isInPeriod = (dateStr, period) => {
  if (period === 'todos') return true;
  const date = new Date(dateStr + 'T12:00:00');
  const now = new Date();
  
  if (period === 'diario') {
    return date.toDateString() === now.toDateString();
  }
  
  if (period === 'semanal') {
    // Semana atual (Segunda a Domingo)
    const currentDay = now.getDay(); // 0 (Dom) a 6 (Sab)
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    return date >= monday && date <= sunday;
  }
  
  if (period === 'mensal') {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
  
  return true;
};

export default function Lancamentos() {
  const { lancamentos, loading, criar, remover } = useLancamentos();
  const { categorias, criarSeNaoExistir } = useCategorias();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [filtro, setFiltro] = useState('todos');
  const [filtroPeriodo, setFiltroPeriodo] = useState('todos');

  const filtrados = lancamentos.filter(
    (l) => (filtro === 'todos' || l.tipo === filtro) && isInPeriod(l.data, filtroPeriodo)
  );

  const totalEntradas = filtrados
    .filter((l) => l.tipo === 'entrada')
    .reduce((acc, l) => acc + (l.valor || 0), 0);

  const totalSaidas = filtrados
    .filter((l) => l.tipo === 'saida')
    .reduce((acc, l) => acc + (l.valor || 0), 0);

  const saldo = totalEntradas - totalSaidas;

  const handleRemover = async (id) => {
    if (!confirm('Remover este lançamento?')) return;
    await remover(id);
    toast.success('Lançamento removido');
  };

  const categoriaById = (id) => categorias.find((c) => c.id === id);

  return (
    <div>
      <div className="page-header">
        <h1>Lançamentos</h1>
        <button className="btn btn-primary" onClick={() => setMostrarForm(true)}>
          + Novo Lançamento
        </button>
      </div>

      {/* Summary cards */}
      <div className="summary-grid">
        <div className="summary-card entrada">
          <span className="label">↑ Total Entradas</span>
          <span className="value">{fmtMoeda(totalEntradas)}</span>
        </div>
        <div className="summary-card saida">
          <span className="label">↓ Total Saídas</span>
          <span className="value">{fmtMoeda(totalSaidas)}</span>
        </div>
        <div className={`summary-card saldo`}>
          <span className="label">= Saldo</span>
          <span className="value" style={{ color: saldo >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {fmtMoeda(saldo)}
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="filtros-container">
          <div className="filtros-bar">
            {FILTROS.map((f) => (
              <button
                key={f}
                className={`filtro-btn ${filtro === f ? 'filtro-ativo' : ''}`}
                onClick={() => setFiltro(f)}
              >
                {f === 'todos' ? 'Todos' : f === 'entrada' ? '↑ Entradas' : '↓ Saídas'}
              </button>
            ))}
          </div>
          
          <div className="filtros-bar">
            {PERIODOS.map((p) => (
              <button
                key={p}
                className={`filtro-btn ${filtroPeriodo === p ? 'filtro-ativo' : ''}`}
                onClick={() => setFiltroPeriodo(p)}
              >
                {p === 'todos' ? 'Qualquer data' : p === 'diario' ? 'Diário' : p === 'semanal' ? 'Semanal' : 'Mensal'}
              </button>
            ))}
            <span className="filtros-count">{filtrados.length} registro{filtrados.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <span className="spinner" />
            <span>Carregando…</span>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">💸</span>
            <p>Nenhum lançamento encontrado</p>
            <button className="btn btn-primary" onClick={() => setMostrarForm(true)}>
              Adicionar Lançamento
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Descrição</th>
                <th>Categorias</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((l) => (
                <tr key={l.id} className="lancamento-row">
                  <td className="col-data">{fmtData(l.data)}</td>
                  <td>
                    <span className={`badge badge-${l.tipo}`}>
                      {l.tipo === 'entrada' ? '↑ Entrada' : '↓ Saída'}
                    </span>
                  </td>
                  <td>
                    <span className={`valor-cell ${l.tipo}`}>
                      {l.tipo === 'saida' ? '-' : '+'}{fmtMoeda(l.valor)}
                    </span>
                  </td>
                  <td className="col-desc">{l.descricao || <span className="text-dim">—</span>}</td>
                  <td>
                    <div className="tag-chips">
                      {(l.categorias || []).map((cid) => {
                        const cat = categoriaById(cid);
                        if (!cat) return null;
                        return (
                          <span
                            key={cid}
                            className="tag-chip"
                            style={{
                              background: cat.cor + '22',
                              borderColor: cat.cor + '55',
                              color: cat.cor,
                            }}
                          >
                            {cat.icone} {cat.nome}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn-icon btn-danger-subtle"
                      onClick={() => handleRemover(l.id)}
                      title="Remover"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {mostrarForm && (
        <LancamentoForm
          categorias={categorias}
          onSalvar={criar}
          onCriarCategoria={criarSeNaoExistir}
          onFechar={() => setMostrarForm(false)}
        />
      )}
    </div>
  );
}
