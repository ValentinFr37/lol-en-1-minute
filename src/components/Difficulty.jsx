import { useT } from '../lib/lang.js'

// Difficulté sous forme de jauge à 3 crans, avec le mot pour les lecteurs d'écran.
export default function Difficulty({ level }) {
  const text = useT()
  if (!level) return null
  return (
    <span className="difficulty" data-level={level}>
      <span className="difficulty-bars" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span key={n} className="difficulty-bar" data-on={n <= level} />
        ))}
      </span>
      {text.difficulty[level]}
    </span>
  )
}
