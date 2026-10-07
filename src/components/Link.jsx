import { navigate } from '../lib/router.js'

// Lien interne : garde le comportement natif (ctrl+clic, clic molette, nouvel onglet).
export default function Link({ to, onClick, ...props }) {
  function handleClick(event) {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(to)
  }
  return <a href={to} onClick={handleClick} {...props} />
}
