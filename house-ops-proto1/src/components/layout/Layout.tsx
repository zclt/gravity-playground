import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, PackageSearch, ShoppingCart, CheckSquare } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div style={{ backgroundColor: 'var(--primary)', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <span style={{ color: 'white', fontWeight: 'bold' }}>H</span>
        </div>
        House Ops
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/produtos" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <PackageSearch size={20} />
          <span>Produtos</span>
        </NavLink>
        
        <NavLink to="/supermercado" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <ShoppingCart size={20} />
          <span>Supermercado</span>
        </NavLink>
        
        <NavLink to="/tarefas" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <CheckSquare size={20} />
          <span>Tarefas Diárias</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
