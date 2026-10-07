import Link from './Link.jsx'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <p>{message}</p>
      <div className="error-actions">
        {onRetry ? (
          <button type="button" className="button" onClick={onRetry}>
            Réessayer
          </button>
        ) : (
          <Link to="/" className="button">
            Retour à la recherche
          </Link>
        )}
      </div>
    </div>
  )
}
