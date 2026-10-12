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
import { navigate } from '../lib/router.js'

export default function ChampionPage({ champion }) {
  const fiche = getFiche(champion.id)
  const detail = useAsync(() => getChampionDetail(champion.id), [champion.id])
  const spells = detail.status === 'ready' ? [detail.data.passive, ...detail.data.spells] : null

  useEffect(() => {
    document.title = `${champion.name} en 1 minute`
    const onKey = (event) => event.key === 'Escape' && navigate('/')
    window.addEventListener('keydown', onKey)
    return () => {
      document.title = 'LoL en 1 minute'
      window.removeEventListener('keydown', onKey)
    }
  }, [champion])

  return (
    <article className="champion">
      <Link to="/" className="back">
        <span aria-hidden="true">‹</span> Changer de champion
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
        <Difficulty label={champion.difficulty} />
      </div>

      {spells && (
        <ol className="spell-strip" aria-label="Sorts">
          {spells.map((spell) => (
            <li key={spell.key}>
              <a href={`#sort-${spell.key}`} className="spell-strip-item" title={spell.name}>
                <GameImage src={spell.icon} label={spell.name} className="spell-strip-icon" width="48" height="48" />
                <SpellKey spellKey={spell.key} className="key-corner" />
              </a>
            </li>
          ))}
        </ol>
      )}

      {fiche ? (
        <Fiche fiche={fiche} />
      ) : (
        <p className="notice">
          Pas encore de fiche rédigée pour {champion.name}. En attendant, voici ses sorts résumés à partir des
          données officielles de Riot.
        </p>
      )}

      {!fiche && detail.status === 'ready' && detail.data.enemyTips.length > 0 && (
        <section className="panel panel-counter" aria-labelledby="conseils">
          <h2 id="conseils" className="panel-title">
            Conseils de Riot pour l&apos;affronter
          </h2>
          <ul className="points">
            {detail.data.enemyTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="panel" aria-labelledby="sorts">
        <h2 id="sorts" className="panel-title">
          Ses sorts
        </h2>
        {detail.status === 'loading' && <p className="status">Chargement des sorts…</p>}
        {detail.status === 'error' && (
          <ErrorState message="Impossible de charger les sorts de ce champion." onRetry={detail.retry} />
        )}
        {spells && <Spells spells={spells} fiche={fiche} />}
      </section>

      {fiche?.patch && <p className="fiche-meta">Fiche vérifiée au patch {fiche.patch}.</p>}
    </article>
  )
}

function Points({ items }) {
  return (
    <ul className="points">
      {items.map((point) => (
        <li key={point}>
          <KeyText>{point}</KeyText>
        </li>
      ))}
    </ul>
  )
}

function Fiche({ fiche }) {
  return (
    <>
      <p className="plan">
        <KeyText>{fiche.plan}</KeyText>
      </p>

      <section className="watch" aria-labelledby="surveiller">
        <h2 id="surveiller" className="watch-title">
          À surveiller
        </h2>
        <p>
          <KeyText>{fiche.aSurveiller}</KeyText>
        </p>
      </section>

      <section className="panel panel-counter" aria-labelledby="battre">
        <h2 id="battre" className="panel-title">
          Comment le battre
        </h2>
        <Points items={fiche.contrer} />
      </section>

      <div className="split">
        <section className="panel panel-threat" aria-labelledby="forces">
          <h2 id="forces" className="panel-title">
            Ses forces
          </h2>
          <Points items={fiche.forces} />
        </section>
        <section className="panel panel-counter" aria-labelledby="faiblesses">
          <h2 id="faiblesses" className="panel-title">
            Ses faiblesses
          </h2>
          <Points items={fiche.faiblesses} />
        </section>
      </div>

      <p className="spike">
        <strong>Quand il devient fort :</strong> <KeyText>{fiche.momentFort}</KeyText>
      </p>
    </>
  )
}

function Spells({ spells, fiche }) {
  return (
    <ul className="spells">
      {spells.map((spell) => (
        <li key={spell.key} id={`sort-${spell.key}`} className="spell" data-key={spell.key.toLowerCase()}>
          <span className="spell-visual">
            <GameImage src={spell.icon} label={spell.name} className="spell-icon" width="52" height="52" loading="lazy" />
            <SpellKey spellKey={spell.key} className="key-corner" />
          </span>
          <div className="spell-body">
            <h3 className="spell-name">
              {spell.name}
              {spell.cooldown && <span className="spell-cooldown">Récupération {spell.cooldown}</span>}
            </h3>
            <p className="spell-summary">
              <KeyText>{fiche?.sorts?.[spell.key] ?? spell.summary}</KeyText>
            </p>
            <details className="spell-details">
              <summary>Description complète</summary>
              <p>{spell.description}</p>
            </details>
          </div>
        </li>
      ))}
    </ul>
  )
}
