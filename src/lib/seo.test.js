import { describe, expect, it } from 'vitest'
import { pageMeta, renderHead, safeJson, truncate, SITE_URL } from './seo.js'

const darius = {
  id: 'Darius',
  name: 'Darius',
  title: 'Main de Noxus',
  roles: ['Combattant', 'Tank'],
}
const fiche = {
  contrer: ["Ne reste pas à portée de son E : c'est lui qui déclenche tous ses combats."],
}

describe('truncate', () => {
  it('coupe sur un mot et ajoute des points de suspension', () => {
    expect(truncate('un deux trois quatre', 12)).toBe('un deux…')
    expect(truncate('court', 12)).toBe('court')
  })
})

describe('pageMeta', () => {
  it("décrit l'accueil", () => {
    const meta = pageMeta({ route: { name: 'home' } })
    expect(meta.canonical).toBe(`${SITE_URL}/`)
    expect(meta.robots).toBe('index,follow')
  })

  it('donne à chaque champion un titre et une adresse uniques', () => {
    const meta = pageMeta({ route: { name: 'champion', id: 'Darius' }, champion: darius })
    expect(meta.title).toBe('Darius : comment le contrer en 1 minute | LoL en 1 minute')
    expect(meta.canonical).toBe(`${SITE_URL}/champion/Darius`)
    expect(meta.title.length <= 70).toBe(true)
  })

  it('reste sous 160 caractères de description, avec ou sans fiche', () => {
    const withFiche = pageMeta({ route: { name: 'champion', id: 'Darius' }, champion: darius, fiche })
    const without = pageMeta({ route: { name: 'champion', id: 'Darius' }, champion: darius })
    expect(withFiche.description.length <= 160).toBe(true)
    expect(without.description.length <= 160).toBe(true)
    expect(withFiche.description).toMatch(/^Comment battre Darius/)
  })

  it("utilise le type Article seulement quand une fiche est rédigée", () => {
    expect(pageMeta({ route: { name: 'champion' }, champion: darius, fiche }).jsonLd[0]['@type']).toBe('Article')
    expect(pageMeta({ route: { name: 'champion' }, champion: darius }).jsonLd[0]['@type']).toBe('WebPage')
  })

  it("demande aux moteurs de ne pas indexer la page 404", () => {
    expect(pageMeta({ route: { name: 'notfound' } }).robots).toBe('noindex,follow')
  })
})

describe('renderHead', () => {
  it('échappe les guillemets dans les attributs', () => {
    const head = renderHead({ ...pageMeta({ route: { name: 'home' } }), description: 'Un "test" & <b>' })
    expect(head).toMatch(/content="Un &quot;test&quot; &amp; &lt;b&gt;"/)
  })
})

describe('safeJson', () => {
  it('empêche de fermer la balise script', () => {
    expect(safeJson({ text: '</script>' })).not.toMatch(/<\/script>/)
  })
})
