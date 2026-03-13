import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/lancamentos', icon: '💸', label: 'Lançamentos' },
  { to: '/categorias', icon: '🏷️', label: 'Categorias' },
  { to: '/graficos', icon: '📊', label: 'Gráficos' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">🐇</span>
        <div className="brand-text">
          <span className="brand-name">money</span>
          <span className="brand-accent">coelho</span>
          <span className="brand-tag">app</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
            <span className="sidebar-arrow">›</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="version-tag">v1.0.0</span>
      </div>
    </aside>
  );
}
