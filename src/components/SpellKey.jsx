import { splitSpellKeys } from '../lib/text.js'

// Touche de sort colorée (P, Q, W, E, R) : chaque touche a sa propre couleur
// partout sur le site, pour qu'on la repère d'un coup d'œil.

const LABELS = { P: 'Passif', Q: 'Sort Q', W: 'Sort W', E: 'Sort E', R: 'Ultime (R)' }

export default function SpellKey({ spellKey, className = '' }) {
  return (
    <kbd className={`key key-${spellKey.toLowerCase()} ${className}`} title={LABELS[spellKey]}>
      {spellKey}
    </kbd>
  )
}

// Affiche un texte rédigé en remplaçant les touches citées par la touche colorée.
export function KeyText({ children }) {
  if (typeof children !== 'string') return children
  return splitSpellKeys(children).map((part, index) =>
    typeof part === 'string' ? part : <SpellKey key={index} spellKey={part.key} className="key-inline" />,
  )
}
