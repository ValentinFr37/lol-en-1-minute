import { ROLE_CSS } from '../lib/ddragon.js'
import { useT } from '../lib/lang.js'

// Rôle avec sa couleur (assassin, combattant, mage…).
export default function RoleTag({ role }) {
  const text = useT()
  return (
    <span className="role-tag" data-role={ROLE_CSS[role]}>
      {text.roles[role] ?? role}
    </span>
  )
}
