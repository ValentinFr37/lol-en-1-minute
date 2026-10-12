import { useMemo, useState } from 'react'
import Link from './components/Link.jsx'
import Backdrop from './components/Backdrop.jsx'
import ErrorState from './components/ErrorState.jsx'
import HomePage from './pages/HomePage.jsx'
import ChampionPage from './pages/ChampionPage.jsx'
import { useAsync } from './hooks/useAsync.js'
import { getChampionList } from './lib/ddragon.js'
import { useRoute } from './lib/router.js'

export default function App() {
  const route = useRoute()
  const list = useAsync(getChampionList, [])
  // La recherche est conservée ici pour la retrouver en revenant à l'accueil.
  const [query, setQuery] = useState('')
  const [role, setRole] = useState(null)
  // Un champion tiré au sort pour l'illustration de l'accueil, le temps de la visite.
  const [seed] = useState(() => Math.random())

  const champions = useMemo(() => list.data?.champions ?? [], [list.data])
  const champion = route.name === 'champion' ? champions.find((c) => c.id === route.id) : null
  const featured = champions.length ? champions[Math.floor(seed * champions.length)] : null

  let page
  if (list.status === 'error') {
    page = (
      <ErrorState
        message="Impossible de charger la liste des champions depuis les serveurs de Riot."
        onRetry={list.retry}
      />
    )
  } else if (route.name === 'champion') {
    page =
      list.status === 'loading' ? (
        <p className="status">Chargement…</p>
      ) : champion ? (
        <ChampionPage key={champion.id} champion={champion} />
      ) : (
        <ErrorState message={`Aucun champion ne correspond à « ${route.id} ».`} />
      )
  } else {
    page = (
      <HomePage
        champions={champions}
        featured={featured}
        loading={list.status === 'loading'}
        query={query}
        onQueryChange={setQuery}
        role={role}
        onRoleChange={setRole}
      />
    )
  }

  const backdropId = route.name === 'champion' ? champion?.id : featured?.id

  return (
    <div className="app" data-page={route.name}>
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
