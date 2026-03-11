import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { SupermarketItem } from '../services/api';
import { Plus, Check, Circle } from 'lucide-react';

export const Supermarket = () => {
  const [items, setItems] = useState<SupermarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const data = await api.getSupermarketList();
    setItems(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quantity) return;
    
    setIsSubmitting(true);
    await api.addSupermarketItem({
      name,
      quantity: Number(quantity),
      completed: false
    });
    
    setName('');
    setQuantity('');
    await fetchItems();
    setIsSubmitting(false);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    await api.toggleSupermarketItem(id, !currentStatus);
    fetchItems();
  };

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Lista de Supermercado</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Organize suas compras e itens necessários.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '2rem' }}>
        <div className="card" style={{ height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Adicionar Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nome do Item</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Maçãs"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Quantidade</label>
              <input
                type="number"
                className="form-input"
                placeholder="Ex: 5"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn" 
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adicionando...' : (
                <>
                  <Plus size={20} /> Adicionar à Lista
                </>
              )}
            </button>
          </form>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Itens na Lista</h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {items.filter(i => i.completed).length} / {items.length} concluídos
            </span>
          </div>
          
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              Carregando lista...
            </p>
          ) : items.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              A lista está vazia.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map(item => (
                <div 
                  key={item.id} 
                  style={{ 
                    padding: '1rem', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    backgroundColor: item.completed ? 'var(--bg-color)' : 'var(--bg-surface)',
                    opacity: item.completed ? 0.7 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <button 
                    onClick={() => handleToggle(item.id, item.completed)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      color: item.completed ? 'var(--primary)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {item.completed ? <Check size={24} /> : <Circle size={24} />}
                  </button>
                  
                  <div style={{ flex: 1, textDecoration: item.completed ? 'line-through' : 'none' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 500, color: item.completed ? 'var(--text-muted)' : 'var(--text-main)' }}>
                      {item.name}
                    </h3>
                  </div>
                  
                  <div style={{ 
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}>
                    {item.quantity} un
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
