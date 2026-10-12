import { useEffect } from 'react'
import Link from '../components/Link.jsx'
import { SITE_NAME } from '../lib/seo.js'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = `Page introuvable | ${SITE_NAME}`
  }, [])

  return (
    <div className="not-found">
      <h1 className="hero-title">Page introuvable</h1>
      <p className="hero-lead">Ce champion ou cette page n&apos;existe pas. Vérifie l&apos;adresse ou lance une recherche.</p>
      <Link to="/" className="button">
        Chercher un champion
      </Link>
    </div>
  )
}
