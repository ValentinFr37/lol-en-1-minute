const LEVELS = { Facile: 1, Moyen: 2, Difficile: 3 }

// Difficulté sous forme de jauge à 3 crans, avec le mot pour les lecteurs d'écran.
export default function Difficulty({ label }) {
  if (!label) return null
  const level = LEVELS[label]
  return (
    <span className="difficulty" data-level={level}>
      <span className="difficulty-bars" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span key={n} className="difficulty-bar" data-on={n <= level} />
        ))}
      </span>
      {label}
    </span>
  )
}
