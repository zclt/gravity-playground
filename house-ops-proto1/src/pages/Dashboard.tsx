import { useEffect, useState } from 'react';
import { PackageSearch, ShoppingCart, CheckSquare } from 'lucide-react';
import { api } from '../services/api';
import type { SupermarketItem, Task } from '../services/api';

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    cartItems: 0,
    pendingTasks: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, cart, tasks] = await Promise.all([
          api.getProducts(),
          api.getSupermarketList(),
          api.getTasks()
        ]);
        
        setStats({
          products: products.length,
          cartItems: cart.filter((i: SupermarketItem) => !i.completed).length,
          pendingTasks: tasks.filter((t: Task) => !t.completed).length
        });
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p style={{ color: 'var(--text-muted)' }}>Carregando dados da casa...</p>
      </div>
    );
  }

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Bem-vindo(a) ao House Ops</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          O controle total da sua casa em um só lugar.
        </p>
      </header>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-icon">
            <PackageSearch size={24} />
          </div>
          <div className="stat-info">
            <h3>Produtos Registrados</h3>
            <p>{stats.products}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-info">
            <h3>Itens no Carrinho</h3>
            <p>{stats.cartItems}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon">
            <CheckSquare size={24} />
          </div>
          <div className="stat-info">
            <h3>Tarefas Pendentes</h3>
            <p>{stats.pendingTasks}</p>
          </div>
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Acesso Rápido</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Utilize o menu lateral para navegar entre os módulos do sistema.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button className="btn" onClick={() => window.location.href = '/produtos'}>
             Ir para Produtos
           </button>
           <button className="btn" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-color)'}} onClick={() => window.location.href = '/supermercado'}>
             Ver Lista
           </button>
        </div>
      </div>
    </div>
  );
};
