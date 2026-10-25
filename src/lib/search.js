import { NICKNAMES } from '../data/nicknames.js'

// "Kog'Maw" -> "kogmaw", "Nunu & Willump" -> "nunuwillump", "Évelynn" -> "evelynn"
export function normalize(value = '') {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

// Distance de Levenshtein bornée : on s'arrête dès que la limite est dépassée.
export function editDistance(a, b, limit = 2) {
  if (Math.abs(a.length - b.length) > limit) return limit + 1
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const curr = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
      rowMin = Math.min(rowMin, curr[j])
    }
    if (rowMin > limit) return limit + 1
    prev = curr
  }
  return prev[b.length]
}

function isSubsequence(query, target) {
  let i = 0
  for (const char of target) if (char === query[i]) i++
  return i === query.length
}

// Toutes les façons de désigner un champion : nom affiché, identifiant, surnoms.
export function searchKeys(champion) {
  const id = champion.id.toLowerCase()
  return [...new Set([normalize(champion.name), normalize(id), ...(NICKNAMES[id] ?? []).map(normalize)])]
}

// Score d'un terme : plus c'est bas, plus c'est pertinent. null = pas de correspondance.
function scoreKey(query, key) {
  if (key === query) return 0
  if (key.startsWith(query)) return 1
  if (key.includes(query)) return 2
  if (query.length >= 3) {
    // Tolère une faute de frappe sur le début du nom ("dairus" -> "darius").
    const limit = query.length >= 6 ? 2 : 1
    if (editDistance(query, key.slice(0, query.length), limit) <= limit) return 3
    if (editDistance(query, key, limit) <= limit) return 3
  }
  if (query.length >= 2 && isSubsequence(query, key)) return 4
  return null
}

export function searchChampions(champions, rawQuery, lang = 'fr') {
  const query = normalize(rawQuery)
  if (!query) return champions

  return champions
    .map((champion) => {
      const scores = searchKeys(champion)
        .map((key) => scoreKey(query, key))
        .filter((score) => score !== null)
      return scores.length ? { champion, score: Math.min(...scores) } : null
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || a.champion.name.localeCompare(b.champion.name, lang))
    .map((result) => result.champion)
}
