import { describe, expect, it } from 'vitest'
import { editDistance, normalize, searchChampions } from './search.js'
import { mapChampionList } from './ddragon.js'
import { rawChampionList } from '../test/fixtures.js'

const champions = mapChampionList(rawChampionList, '99.1.1')
const names = (query) => searchChampions(champions, query).map((c) => c.name)

describe('normalize', () => {
  it('retire accents, apostrophes et espaces', () => {
    expect(normalize("Kog'Maw")).toBe('kogmaw')
    expect(normalize('Évelynn')).toBe('evelynn')
    expect(normalize('Nunu et Willump')).toBe('nunuetwillump')
  })
})

describe('editDistance', () => {
  it('compte les modifications nécessaires', () => {
    expect(editDistance('darius', 'darius')).toBe(0)
    expect(editDistance('dairus', 'darius')).toBe(2)
    expect(editDistance('thresh', 'tresh')).toBe(1)
  })
})

describe('searchChampions', () => {
  it('renvoie tous les champions sans recherche', () => {
    expect(names('')).toHaveLength(champions.length)
  })

  it('trouve par début de nom, sans tenir compte de la casse', () => {
    expect(names('DAR')[0]).toBe('Darius')
  })

  it('ignore la ponctuation et les accents', () => {
    expect(names('kogmaw')[0]).toBe("Kog'Maw")
    expect(names('evelyn')[0]).toBe('Evelynn')
  })

  it('reconnaît les surnoms', () => {
    expect(names('mf')[0]).toBe('Miss Fortune')
    expect(names('kog')[0]).toBe("Kog'Maw")
  })

  it("retrouve Wukong par son nom et par son identifiant Riot", () => {
    expect(names('wukong')[0]).toBe('Wukong')
    expect(names('monkey')[0]).toBe('Wukong')
  })

  it('tolère une faute de frappe', () => {
    expect(names('dairus')[0]).toBe('Darius')
    expect(names('tresh')[0]).toBe('Thresh')
  })

  it("ne renvoie rien quand rien ne correspond", () => {
    expect(names('zzzz')).toEqual([])
  })
})
