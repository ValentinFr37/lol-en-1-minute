import { useEffect } from 'react'
import Link from '../components/Link.jsx'
import GameImage from '../components/GameImage.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { getFiche } from '../content/index.js'
import { useAsync } from '../hooks/useAsync.js'
import { getChampionDetail, imageUrl } from '../lib/ddragon.js'
import { navigate } from '../lib/router.js'

export default function ChampionPage({ champion }) {
  const fiche = getFiche(champion.id)
  const detail = useAsync(() => getChampionDetail(champion.id), [champion.id])

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
    <article className="champion" style={{ '--art': `url(${imageUrl.loading(champion.id)})` }}>
      <Link to="/" className="back">
        Changer de champion
      </Link>

      <header className="champion-header">
        <GameImage src={champion.icon} label={champion.name} className="champion-icon" width="72" height="72" />
        <div>
          <h1 className="champion-name">{champion.name}</h1>
          <p className="champion-title">{champion.title}</p>
          <p className="champion-meta">
            {champion.roles.join(', ')}. Difficulté : {champion.difficulty.toLowerCase()}.
          </p>
        </div>
      </header>

      {fiche ? (
        <Fiche fiche={fiche} />
      ) : (
        <p className="notice">
          Pas encore de fiche rédigée pour {champion.name}. En attendant, voici ses sorts résumés à partir des
          données officielles de Riot.
        </p>
      )}

      <section className="block" aria-labelledby="sorts">
        <h2 id="sorts" className="block-title">
          Ses sorts
        </h2>
        {detail.status === 'loading' && <p className="status">Chargement des sorts…</p>}
        {detail.status === 'error' && (
          <ErrorState message="Impossible de charger les sorts de ce champion." onRetry={detail.retry} />
        )}
        {detail.status === 'ready' && <Spells detail={detail.data} fiche={fiche} />}
      </section>

      {!fiche && detail.status === 'ready' && detail.data.enemyTips.length > 0 && (
        <section className="block block-counter" aria-labelledby="conseils">
          <h2 id="conseils" className="block-title">
            Conseils de Riot pour l&apos;affronter
          </h2>
          <ul className="points">
            {detail.data.enemyTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
      )}

      {fiche?.patch && <p className="fiche-meta">Fiche rédigée au patch {fiche.patch}.</p>}
    </article>
  )
}

function Fiche({ fiche }) {
  return (
    <>
      <p className="plan">{fiche.plan}</p>

      <section className="watch" aria-labelledby="surveiller">
        <h2 id="surveiller" className="watch-title">
          À surveiller
        </h2>
        <p>{fiche.aSurveiller}</p>
      </section>

      <section className="block block-counter" aria-labelledby="battre">
        <h2 id="battre" className="block-title">
          Comment le battre
        </h2>
        <ul className="points">
          {fiche.contrer.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <div className="split">
        <section className="block block-threat" aria-labelledby="forces">
          <h2 id="forces" className="block-title">
            Ses forces
          </h2>
          <ul className="points">
            {fiche.forces.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
        <section className="block block-counter" aria-labelledby="faiblesses">
          <h2 id="faiblesses" className="block-title">
            Ses faiblesses
          </h2>
          <ul className="points">
            {fiche.faiblesses.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      </div>

      <p className="spike">
        <strong>Quand il devient fort :</strong> {fiche.momentFort}
      </p>
    </>
  )
}

function Spells({ detail, fiche }) {
  const spells = [detail.passive, ...detail.spells]
  return (
    <ul className="spells">
      {spells.map((spell) => (
        <li key={spell.key} className="spell">
          <span className="spell-key" aria-label={spell.key === 'P' ? 'Passif' : `Touche ${spell.key}`}>
            {spell.key}
          </span>
          <GameImage src={spell.icon} label={spell.name} className="spell-icon" width="44" height="44" loading="lazy" />
          <div className="spell-body">
            <h3 className="spell-name">{spell.name}</h3>
            <p className="spell-summary">{fiche?.sorts?.[spell.key] ?? spell.summary}</p>
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
