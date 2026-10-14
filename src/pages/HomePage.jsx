import { useEffect, useMemo, useRef } from 'react'
import Link from '../components/Link.jsx'
import GameImage from '../components/GameImage.jsx'
import { hasFiche } from '../content/index.js'
import { ROLES } from '../lib/ddragon.js'
import { championPath, navigate } from '../lib/router.js'
import { normalize, searchChampions } from '../lib/search.js'
import { pageMeta } from '../lib/seo.js'

export default function HomePage({ champions, featured, query, onQueryChange, role, onRoleChange }) {
  const inputRef = useRef(null)

  const results = useMemo(() => {
    const found = searchChampions(champions, query)
    return role ? found.filter((c) => c.roles.includes(role)) : found
  }, [champions, query, role])

  useEffect(() => {
    document.title = pageMeta({ route: { name: 'home' } }).title
  }, [])

  // "/" place le curseur dans la recherche depuis n'importe où sur la page.
  useEffect(() => {
    function onKey(event) {
      if (event.key === '/' && document.activeElement !== inputRef.current) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    if (results[0]) navigate(championPath(results[0].id))
  }

  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">Contre qui tu joues&nbsp;?</h1>
        <p className="hero-lead">
          Les forces, les faiblesses et comment battre chaque champion de League of Legends, le temps de
          l&apos;écran de chargement.
        </p>
        {featured && (
          <p className="credit">
            En fond : <Link to={championPath(featured.id)}>{featured.name}</Link>
          </p>
        )}
      </section>

      <form className="search" role="search" onSubmit={handleSubmit}>
        <div className="search-field">
          <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <label htmlFor="search-input" className="visually-hidden">
            Rechercher un champion
          </label>
          <input
            id="search-input"
            ref={inputRef}
            className="search-input"
            type="search"
            inputMode="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            autoFocus
            placeholder="Darius, MF, Kog…"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
      </form>
      <p className="search-hint" aria-live="polite">
        {query && results[0] && (
          <>
            Entrée pour ouvrir <strong>{results[0].name}</strong>
          </>
        )}
      </p>
      <div className="roles" role="group" aria-label="Filtrer par rôle">
        <button type="button" className="chip" aria-pressed={role === null} onClick={() => onRoleChange(null)}>
          Tous
        </button>
        {ROLES.map((r) => (
          <button
            key={r}
            type="button"
            className="chip"
            data-role={normalize(r)}
            aria-pressed={role === r}
            onClick={() => onRoleChange(role === r ? null : r)}
          >
            {r}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <p className="status">
          Aucun champion ne correspond à « {query} ». Vérifie l&apos;orthographe ou essaie un surnom.
        </p>
      ) : (
        <ul className="grid" aria-label={`${results.length} champions`}>
          {results.map((champion) => (
            <li key={champion.id}>
              <Link to={championPath(champion.id)} className="tile" data-fiche={hasFiche(champion.id)}>
                <GameImage
                  src={champion.icon}
                  label={champion.name}
                  className="tile-icon"
                  loading="lazy"
                  width="120"
                  height="120"
                />
                <span className="tile-name">{champion.name}</span>
                {hasFiche(champion.id) && <span className="tile-badge">À jour</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
