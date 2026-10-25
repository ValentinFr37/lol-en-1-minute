import Link from './Link.jsx'
import { useLang, useT } from '../lib/lang.js'
import { homePath } from '../lib/router.js'

export default function ErrorState({ message, onRetry }) {
  const lang = useLang()
  const text = useT()
  return (
    <div className="error-state" role="alert">
      <p>{message}</p>
      <div className="error-actions">
        {onRetry ? (
          <button type="button" className="button" onClick={onRetry}>
            {text.retry}
          </button>
        ) : (
          <Link to={homePath(lang)} className="button">
            {text.backToSearch}
          </Link>
        )}
      </div>
    </div>
  )
}
