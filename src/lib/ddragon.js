// Accès aux données officielles de Riot via Data Dragon (gratuit, sans clé d'API).
// https://developer.riotgames.com/docs/lol#data-dragon

import { firstSentence, stripTags } from './text.js'

const env = import.meta.env ?? {}
export const DDRAGON_BASE = env.VITE_DDRAGON_BASE || 'https://ddragon.leagueoflegends.com'
export const LOCALE = env.VITE_DDRAGON_LOCALE || 'fr_FR'

export const ROLE_LABELS = {
  Assassin: 'Assassin',
  Fighter: 'Combattant',
  Mage: 'Mage',
  Marksman: 'Tireur',
  Support: 'Support',
  Tank: 'Tank',
}
export const ROLES = Object.values(ROLE_LABELS)

export const SPELL_KEYS = ['Q', 'W', 'E', 'R']

// Riot note la difficulté de 1 à 10 ; 0 signifie « non renseignée ».
export function difficultyLabel(value = 0) {
  if (!value) return null
  if (value <= 3) return 'Facile'
  if (value <= 6) return 'Moyen'
  return 'Difficile'
}

export const imageUrl = {
  square: (version, file) => `${DDRAGON_BASE}/cdn/${version}/img/champion/${file}`,
  spell: (version, file) => `${DDRAGON_BASE}/cdn/${version}/img/spell/${file}`,
  passive: (version, file) => `${DDRAGON_BASE}/cdn/${version}/img/passive/${file}`,
  loading: (id) => `${DDRAGON_BASE}/cdn/img/champion/loading/${id}_0.jpg`,
  splash: (id) => `${DDRAGON_BASE}/cdn/img/champion/splash/${id}_0.jpg`,
}

// --- Transformation des données brutes (fonctions pures, testées) ---

export function mapChampionList(raw, version) {
  return Object.values(raw.data)
    .map((c) => ({
      id: c.id,
      name: c.name,
      title: c.title,
      roles: c.tags.map((tag) => ROLE_LABELS[tag] ?? tag),
      difficulty: difficultyLabel(c.info?.difficulty),
      icon: imageUrl.square(version, c.image.full),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
}

export function mapChampionDetail(raw, version) {
  const c = Object.values(raw.data)[0]
  return {
    id: c.id,
    passive: {
      key: 'P',
      name: c.passive.name,
      summary: firstSentence(c.passive.description),
      description: stripTags(c.passive.description),
      icon: imageUrl.passive(version, c.passive.image.full),
    },
    spells: c.spells.map((spell, index) => ({
      key: SPELL_KEYS[index],
      name: spell.name,
      summary: firstSentence(spell.description),
      description: stripTags(spell.description),
      cooldown: formatCooldown(spell.cooldownBurn),
      icon: imageUrl.spell(version, spell.image.full),
    })),
    enemyTips: (c.enemytips ?? []).map(stripTags).filter(Boolean),
  }
}

// "26/23.5/21/18.5/16" -> "26 à 16 s" ; "5" -> "5 s"
export function formatCooldown(burn) {
  if (!burn || burn === '0') return null
  const values = burn.split('/')
  const first = values[0]
  const last = values[values.length - 1]
  return first === last ? `${first} s` : `${first} à ${last} s`
}

// --- Récupération réseau avec cache de session ---

const memory = new Map()

function readCache(key) {
  if (memory.has(key)) return memory.get(key)
  try {
    const stored = sessionStorage.getItem(key)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function writeCache(key, value) {
  memory.set(key, value)
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Stockage plein ou indisponible (navigation privée) : le cache mémoire suffit.
  }
}

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Data Dragon a répondu ${response.status} pour ${url}`)
  return response.json()
}

let versionPromise
export function getLatestVersion() {
  versionPromise ??= fetchJson(`${DDRAGON_BASE}/api/versions.json`)
    .then((versions) => versions[0])
    .catch((error) => {
      versionPromise = undefined // permet de réessayer après une erreur réseau
      throw error
    })
  return versionPromise
}

// Données déjà intégrées à la page par le pré-rendu : pas besoin de les retélécharger.
export function primeCache({ version, champions, detail }) {
  versionPromise = Promise.resolve(version)
  memory.set(`champions:${version}:${LOCALE}`, champions)
  if (detail) memory.set(`champion:${detail.id}:${version}:${LOCALE}`, detail)
}

export async function getChampionList() {
  const version = await getLatestVersion()
  const key = `champions:${version}:${LOCALE}`
  const cached = readCache(key)
  if (cached) return { version, champions: cached }

  const raw = await fetchJson(`${DDRAGON_BASE}/cdn/${version}/data/${LOCALE}/champion.json`)
  const champions = mapChampionList(raw, version)
  writeCache(key, champions)
  return { version, champions }
}

export async function getChampionDetail(id) {
  const version = await getLatestVersion()
  const key = `champion:${id}:${version}:${LOCALE}`
  const cached = readCache(key)
  if (cached) return cached

  const raw = await fetchJson(`${DDRAGON_BASE}/cdn/${version}/data/${LOCALE}/champion/${id}.json`)
  const detail = mapChampionDetail(raw, version)
  writeCache(key, detail)
  return detail
}
