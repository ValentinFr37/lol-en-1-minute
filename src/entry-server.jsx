// Point d'entrée du pré-rendu : utilisé uniquement au build, dans Node
// (voir scripts/prerender.js), jamais dans le navigateur.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { setServerPathname } from './lib/router.js'

export { mapChampionList, mapChampionDetail } from './lib/ddragon.js'
export { getFiche } from './content/index.js'
export { matchRoute, championPath, homePath } from './lib/router.js'
export { pageMeta, renderHead, safeJson, alternates, SITE_URL } from './lib/seo.js'
export { DEFAULT_LANG, LANGS, LANG_CODES } from './i18n.js'

export function render(pathname, initialData) {
  setServerPathname(pathname)
  return renderToString(
    <StrictMode>
      <App initialData={initialData} />
    </StrictMode>,
  )
}
