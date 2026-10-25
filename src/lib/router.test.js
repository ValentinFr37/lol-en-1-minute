import { describe, expect, it } from 'vitest'
import { championPath, homePath, matchRoute, routePath } from './router.js'

describe('router', () => {
  it('reconnaît la langue dans l’adresse', () => {
    expect(matchRoute('/')).toEqual({ lang: 'fr', name: 'home' })
    expect(matchRoute('/en')).toEqual({ lang: 'en', name: 'home' })
    expect(matchRoute('/es/')).toEqual({ lang: 'es', name: 'home' })
    expect(matchRoute('/champion/Darius')).toEqual({ lang: 'fr', name: 'champion', id: 'Darius' })
    expect(matchRoute('/en/champion/Darius')).toEqual({ lang: 'en', name: 'champion', id: 'Darius' })
  })

  it('ne confond pas une langue inconnue avec une page', () => {
    expect(matchRoute('/de/champion/Darius').name).toBe('notfound')
    expect(matchRoute('/fr/champion/Darius').name).toBe('notfound')
    expect(matchRoute('/english').name).toBe('notfound')
  })

  it('construit les adresses de chaque langue', () => {
    expect(homePath('fr')).toBe('/')
    expect(homePath('es')).toBe('/es')
    expect(championPath('Ahri', 'en')).toBe('/en/champion/Ahri')
    expect(routePath({ name: 'champion', id: 'Ahri' }, 'fr')).toBe('/champion/Ahri')
  })
})
