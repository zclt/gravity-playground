import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Lancamentos from './pages/Lancamentos';
import Categorias from './pages/Categorias';
import Graficos from './pages/Graficos';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/lancamentos" replace />} />
            <Route path="/lancamentos" element={<Lancamentos />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/graficos" element={<Graficos />} />
          </Routes>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1e1e',
            color: '#f5f5f5',
            border: '1px solid #2a2a2a',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.88rem',
          },
          success: {
            iconTheme: { primary: '#2d9e6b', secondary: '#1e1e1e' },
          },
          error: {
            iconTheme: { primary: '#e63946', secondary: '#1e1e1e' },
          },
          duration: 3000,
        }}
      />
    </BrowserRouter>
  );
}
