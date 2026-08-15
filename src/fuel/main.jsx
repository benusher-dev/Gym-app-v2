import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fuel.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
