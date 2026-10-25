// Vérifie que chaque fiche rédigée respecte le format attendu par le site.
// Lancé avec `npm test` : une fiche mal formée est signalée avant d'être mise en ligne.
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { splitSpellKeys } from '../lib/text.js'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'champions')
const files = readdirSync(dir).filter((file) => file.endsWith('.json'))

const TRANSLATIONS = ['en', 'es']
const MAX_LENGTH = 170 // une phrase doit se lire en quelques secondes
const LISTS = ['contrer', 'forces', 'faiblesses']
const SPELLS = ['P', 'Q', 'W', 'E', 'R']

describe('fiches', () => {
  it('existent', () => {
    expect(files.length > 0).toBe(true)
  })

  for (const file of files) {
    describe(file, () => {
      const fiche = JSON.parse(readFileSync(path.join(dir, file), 'utf8'))

      it('a un nom de fichier en minuscules (identifiant Riot)', () => {
        expect(file).toMatch(/^[a-z0-9]+\.json$/)
      })

      it('contient tous les textes', () => {
        for (const field of ['plan', 'aSurveiller', 'momentFort']) {
          expect(typeof fiche[field] === 'string' && fiche[field].length > 0).toBe(true)
        }
      })

      it('a exactement 3 points par liste', () => {
        for (const list of LISTS) expect(fiche[list]).toHaveLength(3)
      })

      it('résume chaque sort (P, Q, W, E, R)', () => {
        expect(Object.keys(fiche.sorts).sort()).toEqual([...SPELLS].sort())
      })

      it('garde des phrases courtes', () => {
        const texts = [fiche.plan, fiche.aSurveiller, fiche.momentFort, ...LISTS.flatMap((l) => fiche[l]), ...Object.values(fiche.sorts)]
        const tooLong = texts.filter((text) => text.length > MAX_LENGTH)
        expect(tooLong).toEqual([])
      })

      it('a un genre valide (facultatif)', () => {
        expect(fiche.genre === undefined || ['f', 'm'].includes(fiche.genre)).toBe(true)
      })

      it('permet de savoir quel sort surveiller', () => {
        const key = fiche.menace ?? splitSpellKeys(fiche.aSurveiller).find((part) => typeof part !== 'string')?.key
        expect(SPELLS.includes(key)).toBe(true)
      })
    })
  }
})

// Textes d'une fiche, dans un ordre fixe, pour comparer une traduction à l'original.
const textsOf = (fiche) => [
  ['plan', fiche.plan],
  ['aSurveiller', fiche.aSurveiller],
  ['momentFort', fiche.momentFort],
  ...LISTS.flatMap((list) => (fiche[list] ?? []).map((text, i) => [`${list}[${i}]`, text])),
  ...SPELLS.map((key) => [`sorts.${key}`, fiche.sorts?.[key]]),
]
const keysIn = (text = '') =>
  splitSpellKeys(text)
    .filter((part) => typeof part !== 'string')
    .map((part) => part.key)
    .sort()
    .join('')

for (const lang of TRANSLATIONS) {
  describe(`traductions (${lang})`, () => {
    const langDir = path.join(dir, lang)
    const translated = readdirSync(langDir).filter((file) => file.endsWith('.json'))

    it('couvrent toutes les fiches françaises', () => {
      expect(files.filter((file) => !translated.includes(file))).toEqual([])
      expect(translated.filter((file) => !files.includes(file))).toEqual([])
    })

    for (const file of translated) {
      describe(`${lang}/${file}`, () => {
        const fiche = JSON.parse(readFileSync(path.join(langDir, file), 'utf8'))
        const original = files.includes(file) ? JSON.parse(readFileSync(path.join(dir, file), 'utf8')) : null

        it('ne contient que des textes (les réglages restent dans la fiche française)', () => {
          for (const field of ['genre', 'menace', 'patch', 'auteur']) expect(fiche[field]).toBe(undefined)
        })

        it('a la même structure que la fiche française', () => {
          for (const list of LISTS) expect(fiche[list]).toHaveLength(3)
          expect(Object.keys(fiche.sorts).sort()).toEqual([...SPELLS].sort())
        })

        it('garde des phrases courtes', () => {
          const tooLong = textsOf(fiche).filter(([, text]) => !text || text.length > MAX_LENGTH)
          expect(tooLong).toEqual([])
        })

        it('cite les mêmes touches que la fiche française', () => {
          if (!original) return
          const mine = textsOf(fiche)
          const diff = textsOf(original)
            .map(([field, text], i) => [field, keysIn(text), keysIn(mine[i][1])])
            .filter(([, a, b]) => a !== b)
          expect(diff).toEqual([])
        })

        it('désigne le même sort à surveiller', () => {
          if (!original || original.menace) return
          const first = (text) => splitSpellKeys(text).find((part) => typeof part !== 'string')?.key
          expect(first(fiche.aSurveiller)).toBe(first(original.aSurveiller))
        })
      })
    }
  })
}
