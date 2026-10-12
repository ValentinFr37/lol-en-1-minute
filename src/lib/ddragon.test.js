import { describe, expect, it } from 'vitest'
import { difficultyLabel, formatCooldown, mapChampionDetail, mapChampionList } from './ddragon.js'
import { firstSentence, splitSpellKeys, stripTags } from './text.js'
import { rawChampionList, rawDariusDetail } from '../test/fixtures.js'

describe('text', () => {
  it('nettoie le pseudo-HTML de Riot', () => {
    expect(stripTags('Inflige des <magicDamage>dégâts</magicDamage>.<br><br>Suite')).toBe(
      'Inflige des dégâts. Suite',
    )
  })

  it('garde la première phrase et tronque si besoin', () => {
    expect(firstSentence('Première phrase. Deuxième.')).toBe('Première phrase.')
    expect(firstSentence('un deux trois quatre cinq', 12)).toBe('un deux…')
  })

  it('repère les touches de sort citées seules', () => {
    expect(splitSpellKeys('Ne reste pas à portée de son E : attention (Q).')).toEqual([
      'Ne reste pas à portée de son ',
      { key: 'E' },
      ' : attention (',
      { key: 'Q' },
      ').',
    ])
  })

  it("ignore les lettres qui font partie d'un mot", () => {
    expect(splitSpellKeys("Et Évite l'E-sport, QWER")).toEqual(["Et Évite l'E-sport, QWER"])
  })
})

describe('mapChampionList', () => {
  const list = mapChampionList(rawChampionList, '99.1.1')

  it('trie par nom et traduit les rôles', () => {
    expect(list[0].name).toBe('Ahri')
    expect(list.find((c) => c.id === 'Darius').roles).toEqual(['Combattant', 'Tank'])
  })

  it("construit l'URL de l'icône", () => {
    expect(list[0].icon).toMatch(/\/cdn\/99\.1\.1\/img\/champion\/Ahri\.png$/)
  })
})

describe('mapChampionDetail', () => {
  const detail = mapChampionDetail(rawDariusDetail, '99.1.1')

  it('associe les sorts à leurs touches', () => {
    expect(detail.spells.map((s) => s.key)).toEqual(['Q', 'W', 'E', 'R'])
    expect(detail.passive.key).toBe('P')
  })

  it('résume chaque sort en une phrase propre', () => {
    expect(detail.passive.summary).toBe('Les attaques de Darius font saigner leur cible.')
    expect(detail.spells[3].summary).not.toMatch(/</)
  })

  it('ignore les conseils vides', () => {
    expect(detail.enemyTips).toEqual(['Restez hors de portée de sa hache.'])
  })
})

describe('difficultyLabel', () => {
  it('regroupe les notes de 1 à 10', () => {
    expect([1, 5, 9].map(difficultyLabel)).toEqual(['Facile', 'Moyen', 'Difficile'])
  })

  it("n'invente pas de difficulté quand Riot ne la renseigne pas", () => {
    expect(difficultyLabel(0)).toBe(null)
  })
})

describe('formatCooldown', () => {
  it('résume les délais de récupération', () => {
    expect(formatCooldown('26/23.5/21/18.5/16')).toBe('26 à 16 s')
    expect(formatCooldown('5')).toBe('5 s')
    expect(formatCooldown('0')).toBe(null)
  })
})
