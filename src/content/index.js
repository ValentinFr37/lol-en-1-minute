// Les fiches rédigées à la main vivent dans ./champions/<id en minuscules>.json
// (ex. darius.json, missfortune.json, monkeyking.json pour Wukong).
// Vite les charge toutes automatiquement : ajouter un fichier suffit.
//
// La fiche française est la référence : elle porte aussi les réglages communs
// (genre, menace, patch, auteur). Les traductions vivent dans ./champions/en/
// et ./champions/es/ et ne contiennent que les textes.

import { DEFAULT_LANG } from '../i18n.js'

const modules = import.meta.glob('./champions/**/*.json', { eager: true, import: 'default' })

const fiches = {}
for (const [path, fiche] of Object.entries(modules)) {
  const [, lang = DEFAULT_LANG, id] = path.match(/^\.\/champions\/(?:([a-z]{2})\/)?([^/]+)\.json$/)
  ;(fiches[lang] ??= {})[id] = fiche
}

export function getFiche(championId, lang = DEFAULT_LANG) {
  const id = championId.toLowerCase()
  const base = fiches[DEFAULT_LANG]?.[id]
  if (!base) return null
  if (lang === DEFAULT_LANG) return base
  const translation = fiches[lang]?.[id]
  if (!translation) return null
  // Les textes viennent de la traduction, les réglages communs de la fiche française.
  return { ...base, ...translation }
}

export function hasFiche(championId, lang = DEFAULT_LANG) {
  return getFiche(championId, lang) !== null
}
