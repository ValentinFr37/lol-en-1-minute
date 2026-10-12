import { normalize } from '../lib/search.js'

// Rôle avec sa couleur (assassin, combattant, mage…).
export default function RoleTag({ role }) {
  return (
    <span className="role-tag" data-role={normalize(role)}>
      {role}
    </span>
  )
}
