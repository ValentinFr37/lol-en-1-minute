import { useEffect, useMemo, useRef } from 'react'
import Link from '../components/Link.jsx'
import GameImage from '../components/GameImage.jsx'
import { ROLES, ROLE_CSS } from '../lib/ddragon.js'
import { championPath, navigate } from '../lib/router.js'
import { searchChampions } from '../lib/search.js'
import { pageMeta } from '../lib/seo.js'
import { useLang, useT } from '../lib/lang.js'

export default function HomePage({ champions, featured, query, onQueryChange, role, onRoleChange }) {
  const inputRef = useRef(null)
  const lang = useLang()
  const text = useT()

  const results = useMemo(() => {
    const found = searchChampions(champions, query, lang)
    return role ? found.filter((c) => c.roles.includes(role)) : found
  }, [champions, query, role, lang])

  useEffect(() => {
    document.title = pageMeta({ route: { name: 'home', lang } }).title
  }, [lang])

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
    if (results[0]) navigate(championPath(results[0].id, lang))
  }

  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">{text.heroTitle}</h1>
        <p className="hero-lead">{text.heroLead}</p>
        {featured && (
          <p className="credit">
            {text.backdropCredit} <Link to={championPath(featured.id, lang)}>{featured.name}</Link>
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
            {text.searchLabel}
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
            placeholder={text.searchPlaceholder}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
      </form>
      <p className="search-hint" aria-live="polite">
        {query && results[0] && (
          <>
            {text.enterToOpen} <strong>{results[0].name}</strong>
          </>
        )}
      </p>
      <div className="roles" role="group" aria-label={text.roleFilter}>
        <button type="button" className="chip" aria-pressed={role === null} onClick={() => onRoleChange(null)}>
          {text.allRoles}
        </button>
        {ROLES.map((r) => (
          <button
            key={r}
            type="button"
            className="chip"
            data-role={ROLE_CSS[r]}
            aria-pressed={role === r}
            onClick={() => onRoleChange(role === r ? null : r)}
          >
            {text.roles[r]}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <p className="status">{text.noResults(query)}</p>
      ) : (
        <ul className="grid" aria-label={text.championCount(results.length)}>
          {results.map((champion) => (
            <li key={champion.id}>
              <Link to={championPath(champion.id, lang)} className="tile">
                <GameImage
                  src={champion.icon}
                  label={champion.name}
                  className="tile-icon"
                  loading="lazy"
                  width="120"
                  height="120"
                />
                <span className="tile-name">{champion.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
