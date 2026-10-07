import { useEffect, useMemo, useRef } from 'react'
import Link from '../components/Link.jsx'
import GameImage from '../components/GameImage.jsx'
import { hasFiche } from '../content/index.js'
import { ROLES } from '../lib/ddragon.js'
import { championPath, navigate } from '../lib/router.js'
import { searchChampions } from '../lib/search.js'

export default function HomePage({ champions, loading, query, onQueryChange, role, onRoleChange }) {
  const inputRef = useRef(null)

  const results = useMemo(() => {
    const found = searchChampions(champions, query)
    return role ? found.filter((c) => c.roles.includes(role)) : found
  }, [champions, query, role])

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
      <h1 className="home-title">Contre qui tu joues ?</h1>
      <p className="home-lead">
        Tape le nom d&apos;un champion pendant l&apos;écran de chargement : ses forces, ses faiblesses et
        comment le battre, en moins d&apos;une minute.
      </p>

      <form className="search" role="search" onSubmit={handleSubmit}>
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
        {query && results[0] && (
          <p className="search-hint">
            Entrée pour ouvrir <strong>{results[0].name}</strong>
          </p>
        )}
      </form>

      <div className="roles" role="group" aria-label="Filtrer par rôle">
        <button type="button" className="chip" aria-pressed={role === null} onClick={() => onRoleChange(null)}>
          Tous
        </button>
        {ROLES.map((r) => (
          <button
            key={r}
            type="button"
            className="chip"
            aria-pressed={role === r}
            onClick={() => onRoleChange(role === r ? null : r)}
          >
            {r}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="status">Chargement des champions…</p>
      ) : results.length === 0 ? (
        <p className="status">
          Aucun champion ne correspond à « {query} ». Vérifie l&apos;orthographe ou essaie un surnom.
        </p>
      ) : (
        <ul className="grid" aria-label={`${results.length} champions`}>
          {results.map((champion) => (
            <li key={champion.id}>
              <Link to={championPath(champion.id)} className="tile">
                <GameImage src={champion.icon} label={champion.name} className="tile-icon" loading="lazy" width="120" height="120" />
                <span className="tile-name">{champion.name}</span>
                {hasFiche(champion.id) && <span className="tile-badge">Fiche</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
