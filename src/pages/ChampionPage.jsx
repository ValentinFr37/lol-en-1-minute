import { useEffect } from 'react'
import Link from '../components/Link.jsx'
import GameImage from '../components/GameImage.jsx'
import ErrorState from '../components/ErrorState.jsx'
import RoleTag from '../components/RoleTag.jsx'
import Difficulty from '../components/Difficulty.jsx'
import SpellKey, { KeyText } from '../components/SpellKey.jsx'
import { getFiche } from '../content/index.js'
import { useAsync } from '../hooks/useAsync.js'
import { getChampionDetail } from '../lib/ddragon.js'
import { homePath, navigate } from '../lib/router.js'
import { SITE_NAME, championTitle } from '../lib/seo.js'
import { splitSpellKeys } from '../lib/text.js'
import { isFeminine } from '../lib/genre.js'
import { useLang, useT } from '../lib/lang.js'

export default function ChampionPage({ champion, initialDetail }) {
  const lang = useLang()
  const text = useT()
  const fiche = getFiche(champion.id, lang)
  const detail = useAsync(() => getChampionDetail(champion.id, lang), [champion.id, lang], initialDetail)
  const spells = detail.data ? [detail.data.passive, ...detail.data.spells] : null

  useEffect(() => {
    document.title = championTitle(champion, fiche, lang)
    const onKey = (event) => event.key === 'Escape' && navigate(homePath(lang))
    window.addEventListener('keydown', onKey)
    return () => {
      document.title = SITE_NAME
      window.removeEventListener('keydown', onKey)
    }
  }, [champion, fiche, lang])

  return (
    <article className="champion">
      <Link to={homePath(lang)} className="back">
        <span aria-hidden="true">‹</span> {text.back}
      </Link>

      <header className="champion-header">
        <GameImage src={champion.icon} label={champion.name} className="champion-icon" width="88" height="88" />
        <div className="champion-heading">
          <h1 className="champion-name">{champion.name}</h1>
          <p className="champion-title">{champion.title}</p>
        </div>
      </header>

      <div className="champion-tags">
        {champion.roles.map((role) => (
          <RoleTag key={role} role={role} />
        ))}
        <Difficulty level={champion.difficulty} />
      </div>

      {spells && <SpellStrip spells={spells} />}

      <div className="fiche-layout">
        <div className="fiche-main">
          {fiche ? (
            <Fiche fiche={fiche} spells={spells} />
          ) : (
            <>
              <p className="notice">{text.noFiche(champion.name)}</p>
              {detail.data?.enemyTips.length > 0 && (
                <section className="section section-counter" aria-labelledby="conseils">
                  <h2 id="conseils" className="section-title">
                    {text.riotTips}
                  </h2>
                  <TipList items={detail.data.enemyTips} />
                </section>
              )}
            </>
          )}
          {fiche?.patch && <p className="fiche-meta">{text.ficheChecked(fiche.patch)}</p>}
        </div>

        <aside className="fiche-aside" aria-labelledby="sorts">
          <h2 id="sorts" className="section-title">
            {text.spells}
          </h2>
          {detail.status === 'loading' && !detail.data && <p className="status">{text.spellsLoading}</p>}
          {detail.status === 'error' && <ErrorState message={text.spellsError} onRetry={detail.retry} />}
          {spells && <Spells spells={spells} fiche={fiche} />}
        </aside>
      </div>
    </article>
  )
}

function SpellStrip({ spells }) {
  const text = useT()
  return (
    <ol className="spell-strip" aria-label={text.spellStrip}>
      {spells.map((spell) => (
        <li key={spell.key}>
          <a href={`#sort-${spell.key}`} className="spell-strip-item" title={spell.name}>
            <GameImage src={spell.icon} label={spell.name} className="spell-strip-icon" width="48" height="48" />
            <SpellKey spellKey={spell.key} className="key-corner" />
          </a>
        </li>
      ))}
    </ol>
  )
}

const CHECK = (
  <svg className="tip-icon" viewBox="0 0 20 20" aria-hidden="true">
    <path d="m5 10.5 3.2 3.2L15 6.5" />
  </svg>
)

function TipList({ items }) {
  return (
    <ul className="tips">
      {items.map((item) => (
        <li key={item} className="tip">
          {CHECK}
          <span>
            <KeyText>{item}</KeyText>
          </span>
        </li>
      ))}
    </ul>
  )
}

function TraitList({ items, sign }) {
  return (
    <ul className="traits">
      {items.map((item) => (
        <li key={item} className="trait">
          <span className="trait-sign" aria-hidden="true">
            {sign}
          </span>
          <span>
            <KeyText>{item}</KeyText>
          </span>
        </li>
      ))}
    </ul>
  )
}

// Le sort à surveiller : champ "menace" de la fiche, sinon la première touche citée.
function threatSpell(fiche, spells) {
  const key = fiche.menace ?? splitSpellKeys(fiche.aSurveiller).find((part) => typeof part !== 'string')?.key
  return key && spells ? spells.find((spell) => spell.key === key) : null
}

function Fiche({ fiche, spells }) {
  const text = useT()
  const threat = threatSpell(fiche, spells)
  const feminine = isFeminine(fiche)
  return (
    <>
      <p className="plan">
        <KeyText>{fiche.plan}</KeyText>
      </p>

      <section className="watch" aria-labelledby="surveiller">
        {threat && (
          <a href={`#sort-${threat.key}`} className="watch-visual" title={threat.name}>
            <GameImage src={threat.icon} label={threat.name} className="watch-icon" width="56" height="56" />
            <SpellKey spellKey={threat.key} className="key-corner" />
          </a>
        )}
        <div className="watch-body">
          <h2 id="surveiller" className="watch-title">
            {text.watch}
          </h2>
          {threat && (
            <p className="watch-spell">
              {threat.name}
              {threat.cooldown && (
                <span className="watch-cooldown">
                  {text.cooldown} {threat.cooldown}
                </span>
              )}
            </p>
          )}
          <p className="watch-text">
            <KeyText>{fiche.aSurveiller}</KeyText>
          </p>
        </div>
      </section>

      <section className="section section-counter" aria-labelledby="battre">
        <h2 id="battre" className="section-title">
          {text.howToBeat(feminine)}
        </h2>
        <TipList items={fiche.contrer} />
      </section>

      <div className="traits-grid">
        <section className="section section-threat" aria-labelledby="forces">
          <h2 id="forces" className="section-title">
            {text.strengths}
          </h2>
          <TraitList items={fiche.forces} sign="+" />
        </section>
        <section className="section section-counter" aria-labelledby="faiblesses">
          <h2 id="faiblesses" className="section-title">
            {text.weaknesses}
          </h2>
          <TraitList items={fiche.faiblesses} sign="−" />
        </section>
      </div>

      <p className="spike">
        <span className="spike-label">
          {text.whenStrong(feminine)}
        </span>
        <span>
          <KeyText>{fiche.momentFort}</KeyText>
        </span>
      </p>
    </>
  )
}

function Spells({ spells, fiche }) {
  const text = useT()
  return (
    <ul className="spells">
      {spells.map((spell) => (
        <li key={spell.key} id={`sort-${spell.key}`} className="spell">
          <span className="spell-visual">
            <GameImage src={spell.icon} label={spell.name} className="spell-icon" width="48" height="48" loading="lazy" />
            <SpellKey spellKey={spell.key} className="key-corner" />
          </span>
          <div className="spell-body">
            <h3 className="spell-name">{spell.name}</h3>
            {spell.cooldown && (
              <p className="spell-cooldown">
                {text.cooldown} {spell.cooldown}
              </p>
            )}
            <p className="spell-summary">
              <KeyText>{fiche?.sorts?.[spell.key] ?? spell.summary}</KeyText>
            </p>
            <details className="spell-details">
              <summary>{text.fullDescription}</summary>
              <p>{spell.description}</p>
            </details>
          </div>
        </li>
      ))}
    </ul>
  )
}
