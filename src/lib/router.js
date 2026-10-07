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
  const champion = pathname.match(/^\/champion\/([A-Za-z0-9]+)\/?$/)
  if (champion) return { name: 'champion', id: champion[1] }
  return { name: 'home' }
}

export function useRoute() {
  const pathname = useSyncExternalStore(subscribe, () => window.location.pathname)
  return matchRoute(pathname)
}

export const championPath = (id) => `/champion/${id}`
