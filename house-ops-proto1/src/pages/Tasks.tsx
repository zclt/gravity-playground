import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Task } from '../services/api';
import { Plus, Check, Circle } from 'lucide-react';

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    const data = await api.getTasks();
    setTasks(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setIsSubmitting(true);
    await api.addTask({
      title,
      completed: false,
      date: new Date().toISOString().split('T')[0]
    });
    
    setTitle('');
    await fetchTasks();
    setIsSubmitting(false);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    await api.toggleTask(id, !currentStatus);
    fetchTasks();
  };

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Tarefas Diárias</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Mantenha sua rotina em dia.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '2rem' }}>
        <div className="card" style={{ height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Nova Tarefa</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Descrição da Tarefa</label>
              <textarea
                className="form-input"
                placeholder="Ex: Limpar a garagem..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn" 
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : (
                <>
                  <Plus size={20} /> Adicionar Tarefa
                </>
              )}
            </button>
          </form>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Suas Tarefas</h2>
            <div style={{ 
              backgroundColor: 'var(--primary-light)', 
              color: 'var(--primary-hover)',
              padding: '0.25rem 0.75rem',
              borderRadius: '99px',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}>
              {tasks.filter(t => t.completed).length} / {tasks.length} concluídas
            </div>
          </div>
          
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              Carregando tarefas...
            </p>
          ) : tasks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              Nenhuma tarefa cadastrada. Aproveite o dia!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  style={{ 
                    padding: '1rem', 
                    borderLeft: `4px solid ${task.completed ? 'var(--border-color)' : 'var(--primary)'}`,
                    borderTop: '1px solid var(--border-color)',
                    borderRight: '1px solid var(--border-color)',
                    borderBottom: '1px solid var(--border-color)',
                    borderRadius: '0 var(--radius) var(--radius) 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    backgroundColor: task.completed ? 'var(--bg-color)' : 'var(--bg-surface)',
                    opacity: task.completed ? 0.7 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <button 
                    onClick={() => handleToggle(task.id, task.completed)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      color: task.completed ? 'var(--primary)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {task.completed ? <Check size={24} /> : <Circle size={24} />}
                  </button>
                  
                  <div style={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 500, color: task.completed ? 'var(--text-muted)' : 'var(--text-main)' }}>
                      {task.title}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      Adicionada: {new Date(task.date).toLocaleDateString()}
                    </p>
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
