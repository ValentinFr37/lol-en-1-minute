import { useEffect } from 'react'
import Link from '../components/Link.jsx'
import { SITE_NAME } from '../lib/seo.js'
import { homePath } from '../lib/router.js'
import { useLang, useT } from '../lib/lang.js'

export default function NotFoundPage() {
  const lang = useLang()
  const text = useT()

  useEffect(() => {
    document.title = `${text.notFoundTitle} | ${SITE_NAME}`
  }, [text])

  return (
    <div className="not-found">
      <h1 className="hero-title">{text.notFoundTitle}</h1>
      <p className="hero-lead">{text.notFoundLead}</p>
      <Link to={homePath(lang)} className="button">
        {text.notFoundButton}
      </Link>
    </div>
  )
}
