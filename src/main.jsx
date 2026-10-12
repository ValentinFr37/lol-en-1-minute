import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import { primeCache } from './lib/ddragon.js'
import './styles.css'

const container = document.getElementById('root')
const dataElement = document.getElementById('initial-data')
const initialData = dataElement ? JSON.parse(dataElement.textContent) : null

const app = (
  <StrictMode>
    <App initialData={initialData} />
  </StrictMode>
)

if (initialData) {
  // Page pré-rendue au build : React reprend la main sur le HTML existant.
  primeCache(initialData)
  hydrateRoot(container, app)
} else {
  // Développement (npm run dev) : rendu classique dans le navigateur.
  createRoot(container).render(app)
}
