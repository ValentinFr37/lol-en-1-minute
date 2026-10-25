import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import { primeCache } from './lib/ddragon.js'
import { matchRoute } from './lib/router.js'
import './styles.css'

const container = document.getElementById('root')
const dataElement = document.getElementById('initial-data')
const initialData = dataElement ? JSON.parse(dataElement.textContent) : null

const app = (
  <StrictMode>
    <App initialData={initialData} />
  </StrictMode>
)

if (initialData) primeCache(initialData)

if (initialData && initialData.lang === matchRoute(window.location.pathname).lang) {
  // Page pré-rendue au build : React reprend la main sur le HTML existant.
  hydrateRoot(container, app)
} else {
  // Développement (npm run dev), ou page 404 commune servie pour une adresse
  // dans une autre langue : rendu classique dans le navigateur.
  createRoot(container).render(app)
}
