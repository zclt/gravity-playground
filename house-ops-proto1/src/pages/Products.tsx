import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Product } from '../services/api';
import { Plus } from 'lucide-react';

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await api.getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !stock) return;
    
    setIsSubmitting(true);
    await api.addProduct({
      name,
      category,
      stock: Number(stock)
    });
    
    // Reset and refetch
    setName('');
    setCategory('');
    setStock('');
    await fetchProducts();
    setIsSubmitting(false);
  };

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Cadastro de Produtos</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Gerencie os produtos que você utiliza em casa.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '2rem' }}>
        <div className="card" style={{ height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Adicionar Produto</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Detergente"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Limpeza"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estoque Atual</label>
              <input
                type="number"
                className="form-input"
                placeholder="Ex: 2"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn" 
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : (
                <>
                  <Plus size={20} /> Adicionar Produto
                </>
              )}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Lista de Produtos ({products.length})</h2>
          
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              Carregando produtos...
            </p>
          ) : products.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              Nenhum produto cadastrado.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {products.map(product => (
                <div 
                  key={product.id} 
                  style={{ 
                    padding: '1rem', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{product.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{product.category}</p>
                  </div>
                  <div style={{ 
                    backgroundColor: 'var(--primary-light)', 
                    color: 'var(--primary-hover)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '99px',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}>
                    {product.stock} un
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
