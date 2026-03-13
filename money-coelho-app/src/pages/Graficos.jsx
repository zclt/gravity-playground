import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useLancamentos } from '../hooks/useLancamentos';
import './Graficos.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MODOS = [
  { key: 'diario', label: '📅 Diário' },
  { key: 'semanal', label: '📆 Semanal' },
  { key: 'mensal', label: '🗓️ Mensal' },
];

function getLabelsEDados(lancamentos, modo) {
  const now = new Date();

  if (modo === 'diario') {
    // Últimos 14 dias
    const dias = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (13 - i));
      return d.toISOString().split('T')[0];
    });

    const entradas = dias.map((dia) =>
      lancamentos
        .filter((l) => l.data === dia && l.tipo === 'entrada')
        .reduce((s, l) => s + (l.valor || 0), 0)
    );

    const saidas = dias.map((dia) =>
      lancamentos
        .filter((l) => l.data === dia && l.tipo === 'saida')
        .reduce((s, l) => s + (l.valor || 0), 0)
    );

    const labels = dias.map((d) =>
      new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    );

    return { labels, entradas, saidas };
  }

  if (modo === 'semanal') {
    // Últimas 8 semanas
    const semanas = Array.from({ length: 8 }, (_, i) => {
      const inicio = new Date(now);
      inicio.setDate(inicio.getDate() - inicio.getDay() - (7 - i) * 7);
      const fim = new Date(inicio);
      fim.setDate(fim.getDate() + 6);
      return { inicio: inicio.toISOString().split('T')[0], fim: fim.toISOString().split('T')[0] };
    });

    const entradas = semanas.map(({ inicio, fim }) =>
      lancamentos
        .filter((l) => l.data >= inicio && l.data <= fim && l.tipo === 'entrada')
        .reduce((s, l) => s + (l.valor || 0), 0)
    );

    const saidas = semanas.map(({ inicio, fim }) =>
      lancamentos
        .filter((l) => l.data >= inicio && l.data <= fim && l.tipo === 'saida')
        .reduce((s, l) => s + (l.valor || 0), 0)
    );

    const labels = semanas.map(({ inicio }) => {
      const d = new Date(inicio + 'T12:00:00');
      return `Sem ${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`;
    });

    return { labels, entradas, saidas };
  }

  // mensal — últimos 12 meses
  const meses = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return { ano: d.getFullYear(), mes: d.getMonth() + 1 };
  });

  const entradas = meses.map(({ ano, mes }) =>
    lancamentos
      .filter((l) => {
        const d = new Date(l.data + 'T12:00:00');
        return d.getFullYear() === ano && d.getMonth() + 1 === mes && l.tipo === 'entrada';
      })
      .reduce((s, l) => s + (l.valor || 0), 0)
  );

  const saidas = meses.map(({ ano, mes }) =>
    lancamentos
      .filter((l) => {
        const d = new Date(l.data + 'T12:00:00');
        return d.getFullYear() === ano && d.getMonth() + 1 === mes && l.tipo === 'saida';
      })
      .reduce((s, l) => s + (l.valor || 0), 0)
  );

  const labels = meses.map(({ ano, mes }) => {
    const d = new Date(ano, mes - 1, 1);
    return d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
  });

  return { labels, entradas, saidas };
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#f5f5f5',
        font: { family: 'Inter', size: 13 },
        usePointStyle: true,
        pointStyle: 'rectRounded',
      },
    },
    tooltip: {
      backgroundColor: '#1e1e1e',
      borderColor: '#2a2a2a',
      borderWidth: 1,
      titleColor: '#f5f5f5',
      bodyColor: '#aaa',
      callbacks: {
        label: (ctx) => {
          const val = ctx.parsed.y;
          return ` ${ctx.dataset.label}: ${val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { color: '#2a2a2a' },
      ticks: { color: '#888', font: { size: 11 } },
    },
    y: {
      grid: { color: '#2a2a2a' },
      ticks: {
        color: '#888',
        font: { size: 11 },
        callback: (v) => `R$${(v / 1000).toFixed(0)}k`,
      },
    },
  },
};

export default function Graficos() {
  const { lancamentos, loading } = useLancamentos();
  const [modo, setModo] = useState('mensal');

  const { labels, entradas, saidas } = useMemo(
    () => getLabelsEDados(lancamentos, modo),
    [lancamentos, modo]
  );

  const totalEnt = entradas.reduce((a, b) => a + b, 0);
  const totalSai = saidas.reduce((a, b) => a + b, 0);
  const saldo = totalEnt - totalSai;

  const fmtMoeda = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const chartData = {
    labels,
    datasets: [
      {
        label: '↑ Entradas',
        data: entradas,
        backgroundColor: 'rgba(45, 158, 107, 0.75)',
        borderColor: '#2d9e6b',
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: '↓ Saídas',
        data: saidas,
        backgroundColor: 'rgba(230, 57, 70, 0.75)',
        borderColor: '#e63946',
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div>
      <div className="page-header">
        <h1>Gráficos Comparativos</h1>
      </div>

      {/* Modo seletor */}
      <div className="modo-tabs">
        {MODOS.map((m) => (
          <button
            key={m.key}
            className={`modo-tab ${modo === m.key ? 'ativo' : ''}`}
            onClick={() => setModo(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Resumo */}
      <div className="summary-grid" style={{ marginBottom: '24px' }}>
        <div className="summary-card entrada">
          <span className="label">↑ Total Entradas</span>
          <span className="value">{fmtMoeda(totalEnt)}</span>
        </div>
        <div className="summary-card saida">
          <span className="label">↓ Total Saídas</span>
          <span className="value">{fmtMoeda(totalSai)}</span>
        </div>
        <div className="summary-card saldo">
          <span className="label">= Saldo</span>
          <span className="value" style={{ color: saldo >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {fmtMoeda(saldo)}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h3 className="chart-title">
          {modo === 'diario' ? 'Últimos 14 dias' : modo === 'semanal' ? 'Últimas 8 semanas' : 'Últimos 12 meses'}
        </h3>
        {loading ? (
          <div className="loading-state">
            <span className="spinner" /> <span>Carregando…</span>
          </div>
        ) : (
          <div className="chart-wrap">
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
}
