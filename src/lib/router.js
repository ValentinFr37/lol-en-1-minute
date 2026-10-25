// Mini-routeur basé sur l'History API : deux pages ne justifient pas une dépendance.
// Les adresses françaises sont à la racine (/champion/Darius), les autres langues
// ont un préfixe (/en/champion/Darius, /es/champion/Darius).
import { useSyncExternalStore } from 'react'
import { DEFAULT_LANG, LANGS, isLang } from '../i18n.js'

const NAVIGATE_EVENT = 'app:navigate'

function subscribe(callback) {
  window.addEventListener('popstate', callback)
  window.addEventListener(NAVIGATE_EVENT, callback)
  return () => {
    window.removeEventListener('popstate', callback)
    window.removeEventListener(NAVIGATE_EVENT, callback)
  }
}

export function navigate(path) {
  if (path === window.location.pathname) return
  window.history.pushState({}, '', path)
  window.dispatchEvent(new Event(NAVIGATE_EVENT))
  window.scrollTo(0, 0)
}

export function matchRoute(pathname = '/') {
  let lang = DEFAULT_LANG
  let rest = pathname
  const prefix = pathname.match(/^\/([a-z]{2})(?=\/|$)/)
  if (prefix && isLang(prefix[1]) && prefix[1] !== DEFAULT_LANG) {
    lang = prefix[1]
    rest = pathname.slice(3)
  }
  if (rest === '/' || rest === '') return { lang, name: 'home' }
  const champion = rest.match(/^\/champion\/([A-Za-z0-9]+)\/?$/)
  if (champion) return { lang, name: 'champion', id: champion[1] }
  return { lang, name: 'notfound' }
}

// Pendant le pré-rendu (Node), il n'y a pas de window : l'URL est fournie par le script.
let serverPathname = '/'
export function setServerPathname(pathname) {
  serverPathname = pathname
}

const getPathname = () => window.location.pathname
const getServerPathname = () => (typeof window === 'undefined' ? serverPathname : window.location.pathname)

export function useRoute() {
  const pathname = useSyncExternalStore(subscribe, getPathname, getServerPathname)
  return matchRoute(pathname)
}

export const homePath = (lang = DEFAULT_LANG) => LANGS[lang].prefix || '/'
export const championPath = (id, lang = DEFAULT_LANG) => `${LANGS[lang].prefix}/champion/${id}`

// La même page dans une autre langue (pour le sélecteur de langue et les balises hreflang).
export function routePath(route, lang) {
  if (route.name === 'champion') return championPath(route.id, lang)
  return homePath(lang)
}
