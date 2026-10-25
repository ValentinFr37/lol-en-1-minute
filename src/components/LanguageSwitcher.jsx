import Link from './Link.jsx'
import { LANGS, LANG_CODES } from '../i18n.js'
import { useLang, useT } from '../lib/lang.js'
import { routePath } from '../lib/router.js'

// Drapeaux en SVG : les émojis drapeaux ne s'affichent pas sous Windows.
const FLAGS = {
  fr: (
    <>
      <rect width="3" height="2" fill="#ED2939" />
      <rect width="2" height="2" fill="#fff" />
      <rect width="1" height="2" fill="#002395" />
    </>
  ),
  es: (
    <>
      <rect width="3" height="2" fill="#AA151B" />
      <rect y="0.5" width="3" height="1" fill="#F1BF00" />
    </>
  ),
  // Union Jack simplifié, recadré au format 3:2 des autres drapeaux.
  en: (
    <svg viewBox="0 0 60 30" width="3" height="2" preserveAspectRatio="xMidYMid slice">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 60,30 M60,0 0,30" stroke="#fff" strokeWidth="6" />
      <clipPath id="flag-uk-diagonals">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <path d="M0,0 60,30 M60,0 0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#flag-uk-diagonals)" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  ),
}

export function Flag({ lang }) {
  return (
    <svg className="flag" viewBox="0 0 3 2" aria-hidden="true">
      {FLAGS[lang]}
    </svg>
  )
}

// Sélecteur de langue : un drapeau par langue, qui mène à la même page traduite.
export default function LanguageSwitcher({ route }) {
  const current = useLang()
  const text = useT()
  return (
    <nav className="languages" aria-label={text.languages}>
      {LANG_CODES.map((code) => (
        <Link
          key={code}
          to={routePath(route, code)}
          className="language"
          hrefLang={code}
          lang={code}
          title={LANGS[code].name}
          aria-label={LANGS[code].name}
          aria-current={code === current ? 'true' : undefined}
        >
          <Flag lang={code} />
        </Link>
      ))}
    </nav>
  )
}
