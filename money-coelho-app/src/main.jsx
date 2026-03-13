import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { seedDefaultCategorias } from './api'

// Popula categorias default no localStorage, se necessário
seedDefaultCategorias()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
