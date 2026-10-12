import { useEffect, useMemo, useState } from 'react'
import Link from './components/Link.jsx'
import Backdrop from './components/Backdrop.jsx'
import ErrorState from './components/ErrorState.jsx'
import HomePage from './pages/HomePage.jsx'
import ChampionPage from './pages/ChampionPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { useAsync } from './hooks/useAsync.js'
import { getChampionList } from './lib/ddragon.js'
import { useRoute } from './lib/router.js'
import { KOFI_URL } from './config.js'

// `initialData` : données intégrées à la page par le pré-rendu
// ({ version, champions, detail }). Absent en développement.
export default function App({ initialData = null }) {
  const route = useRoute()
  const list = useAsync(
    getChampionList,
    [],
    initialData ? { version: initialData.version, champions: initialData.champions } : undefined,
  )
  // La recherche est conservée ici pour la retrouver en revenant à l'accueil.
  const [query, setQuery] = useState('')
  const [role, setRole] = useState(null)

  // Champion tiré au sort pour l'illustration de l'accueil. Le tirage se fait après
  // l'affichage pour que la page pré-rendue et la page dans le navigateur soient identiques.
  const [seed, setSeed] = useState(null)
  useEffect(() => setSeed(Math.random()), [])

  const champions = useMemo(() => list.data?.champions ?? [], [list.data])
  const champion = route.name === 'champion' ? champions.find((c) => c.id === route.id) : null
  const featured = champions.length && seed !== null ? champions[Math.floor(seed * champions.length)] : null
  // Une adresse de champion inconnu est une page introuvable, comme sur le serveur.
  const pageName = route.name === 'champion' && list.status === 'ready' && !champion ? 'notfound' : route.name

  let page
  if (list.status === 'error') {
    page = (
      <ErrorState
        message="Impossible de charger la liste des champions depuis les serveurs de Riot."
        onRetry={list.retry}
      />
    )
  } else if (list.status === 'loading') {
    page = <p className="status">Chargement…</p>
  } else if (route.name === 'champion' && champion) {
    const initialDetail = initialData?.detail?.id === champion.id ? initialData.detail : undefined
    page = <ChampionPage key={champion.id} champion={champion} initialDetail={initialDetail} />
  } else if (route.name === 'home') {
    page = (
      <HomePage
        champions={champions}
        featured={featured}
        query={query}
        onQueryChange={setQuery}
        role={role}
        onRoleChange={setRole}
      />
    )
  } else {
    page = <NotFoundPage />
  }

  const backdropId = route.name === 'champion' ? champion?.id : route.name === 'home' ? featured?.id : null

  return (
    <div className="app" data-page={pageName}>
      <Backdrop championId={backdropId} />

      <header className="site-header">
        <Link to="/" className="brand" aria-label="LoL en 1 minute, accueil">
          <span className="brand-mark" aria-hidden="true">
            1
          </span>
          <span>LoL en 1 minute</span>
        </Link>
      </header>

      <main className="site-main">{page}</main>

      <footer className="site-footer">
        {KOFI_URL && (
          <p className="support">
            Le site t&apos;a aidé ?{' '}
            <a href={KOFI_URL} className="support-link" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 8h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" />
                <path d="M16 9h1.5a2.5 2.5 0 0 1 0 5H16" />
                <path d="M8 3.5c0 1 1 1 1 2M12 3.5c0 1 1 1 1 2" />
              </svg>
              Offre-moi un café sur Ko-fi
            </a>
          </p>
        )}
        <p>
          LoL en 1 minute n&apos;est pas approuvé par Riot Games et ne reflète pas les opinions de Riot Games
          ni de quiconque officiellement impliqué dans la production ou la gestion de League of Legends.
          League of Legends et Riot Games sont des marques commerciales ou des marques déposées de Riot
          Games, Inc.
        </p>
        {list.data && <p>Données du jeu : patch {list.data.version}.</p>}
      </footer>
    </div>
  )
}
