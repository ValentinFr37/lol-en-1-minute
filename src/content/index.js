// Les fiches rédigées à la main vivent dans ./champions/<id en minuscules>.json
// (ex. darius.json, missfortune.json, monkeyking.json pour Wukong).
// Vite les charge toutes automatiquement : ajouter un fichier suffit.

const modules = import.meta.glob('./champions/*.json', { eager: true, import: 'default' })

const fiches = Object.fromEntries(
  Object.entries(modules).map(([path, fiche]) => [path.match(/([^/]+)\.json$/)[1], fiche]),
)

export function getFiche(championId) {
  return fiches[championId.toLowerCase()] ?? null
}

export function hasFiche(championId) {
  return championId.toLowerCase() in fiches
}
