// Mini-routeur basé sur l'History API : deux pages ne justifient pas une dépendance.
import { useSyncExternalStore } from 'react'

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

export function matchRoute(pathname) {
  if (pathname === '/' || pathname === '') return { name: 'home' }
  const champion = pathname.match(/^\/champion\/([A-Za-z0-9]+)\/?$/)
  if (champion) return { name: 'champion', id: champion[1] }
  return { name: 'notfound' }
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

export const championPath = (id) => `/champion/${id}`
