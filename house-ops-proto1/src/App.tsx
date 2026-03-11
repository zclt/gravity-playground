import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Supermarket } from './pages/Supermarket';
import { Tasks } from './pages/Tasks';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="produtos" element={<Products />} />
          <Route path="supermercado" element={<Supermarket />} />
          <Route path="tarefas" element={<Tasks />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
