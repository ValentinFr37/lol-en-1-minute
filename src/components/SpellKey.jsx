import { splitSpellKeys } from '../lib/text.js'
import { useT } from '../lib/lang.js'

// Touche de sort colorée (P, Q, W, E, R) : chaque touche a sa propre couleur
// partout sur le site, pour qu'on la repère d'un coup d'œil.

export default function SpellKey({ spellKey, className = '' }) {
  const text = useT()
  return (
    <kbd className={`key key-${spellKey.toLowerCase()} ${className}`} title={text.keyLabels[spellKey]}>
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
