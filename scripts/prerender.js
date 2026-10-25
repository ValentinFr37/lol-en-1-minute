// Pré-rendu des pages pour le référencement (exécuté par `npm run build`, après Vite).
//
// Pour l'accueil et chaque champion, dans chaque langue (fr à la racine, /en, /es), ce script :
//   1. récupère les données officielles de Riot (Data Dragon) ;
//   2. génère le HTML de la page avec React (le même code que dans le navigateur) ;
//   3. écrit un vrai fichier HTML avec son titre, sa description et ses balises de partage,
//      plus les données utilisées, pour que React reprenne la main sans rien retélécharger.
// Il produit aussi sitemap.xml, robots.txt et la page 404.

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js')

const DDRAGON_BASE = (process.env.VITE_DDRAGON_BASE || 'https://ddragon.leagueoflegends.com').replace(/\/$/, '')
const CONCURRENCY = 12

const HEAD_BLOCK = /<!--app-head-->[\s\S]*?<!--\/app-head-->/
const ROOT_DIV = '<div id="root"></div>'
const HTML_LANG = /<html lang="[^"]*">/

async function fetchJson(url, attempts = 3) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      if (attempt >= attempts) throw new Error(`Impossible de récupérer ${url} : ${error.message}`)
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
    }
  }
}

// Exécute `task` sur chaque élément, avec au plus `limit` requêtes en parallèle.
async function mapLimit(items, limit, task) {
  const results = new Array(items.length)
  let next = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++
      results[index] = await task(items[index], index)
    }
  })
  await Promise.all(workers)
  return results
}

const xmlEscape = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

async function main() {
  const started = Date.now()
  const ssr = await import(pathToFileURL(ssrEntry).href)
  const template = await readFile(path.join(dist, 'index.html'), 'utf8')
  if (!HEAD_BLOCK.test(template) || !template.includes(ROOT_DIV) || !HTML_LANG.test(template)) {
    throw new Error('index.html doit contenir <html lang="…">, <!--app-head-->…<!--/app-head--> et <div id="root"></div>')
  }

  // 1. Données Riot (la version du jeu est commune, les textes dépendent de la langue)
  const [version] = await fetchJson(`${DDRAGON_BASE}/api/versions.json`)
  const data = {}
  for (const lang of ssr.LANG_CODES) {
    const locale = ssr.LANGS[lang].ddragon
    const rawList = await fetchJson(`${DDRAGON_BASE}/cdn/${version}/data/${locale}/champion.json`)
    const champions = ssr.mapChampionList(rawList, version, lang)
    const details = await mapLimit(champions, CONCURRENCY, async (champion) => {
      const raw = await fetchJson(`${DDRAGON_BASE}/cdn/${version}/data/${locale}/champion/${champion.id}.json`)
      return ssr.mapChampionDetail(raw, version, lang)
    })
    data[lang] = { champions, details }
  }

  // 2. Génération des pages
  function renderPage(pathname, { champion = null, detail = null } = {}) {
    const route = ssr.matchRoute(pathname)
    const { lang } = route
    const initialData = { version, lang, champions: data[lang].champions, detail }
    const fiche = champion ? ssr.getFiche(champion.id, lang) : null
    const meta = ssr.pageMeta({ route, champion, fiche })
    const appHtml = ssr.render(pathname, initialData)
    return template
      .replace(HTML_LANG, `<html lang="${lang}">`)
      .replace(HEAD_BLOCK, ssr.renderHead(meta))
      .replace(
        ROOT_DIV,
        `<div id="root">${appHtml}</div>\n    <script type="application/json" id="initial-data">${ssr.safeJson(initialData)}</script>`,
      )
  }

  async function writePage(file, html) {
    const target = path.join(dist, file)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, html)
  }

  // Avec "cleanUrls" (vercel.json), champion/Darius.html est servi à l'adresse /champion/Darius,
  // en.html à l'adresse /en et en/champion/Darius.html à /en/champion/Darius.
  const fileFor = (pathname) => (pathname === '/' ? 'index.html' : `${pathname.slice(1)}.html`)
  const routes = []
  for (const lang of ssr.LANG_CODES) {
    const home = ssr.homePath(lang)
    await writePage(fileFor(home), renderPage(home))
    routes.push({ name: 'home' })
    for (const [index, champion] of data[lang].champions.entries()) {
      const pathname = ssr.championPath(champion.id, lang)
      await writePage(fileFor(pathname), renderPage(pathname, { champion, detail: data[lang].details[index] }))
      if (lang === ssr.DEFAULT_LANG) routes.push({ name: 'champion', id: champion.id })
    }
  }
  await writePage('404.html', renderPage('/404'))

  // 3. Plan du site (chaque page avec ses versions traduites) et consignes pour les robots
  const uniqueRoutes = routes.filter((route, index) => route.name !== 'home' || index === 0)
  const entries = uniqueRoutes.flatMap((route) => {
    const links = ssr.alternates(route)
    const xhtml = links
      .map((alt) => `<xhtml:link rel="alternate" hreflang="${alt.lang}" href="${xmlEscape(alt.href)}"/>`)
      .join('')
    return links.map((alt) => `  <url><loc>${xmlEscape(alt.href)}</loc>${xhtml}</url>`)
  })
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n')
  await writeFile(path.join(dist, 'sitemap.xml'), sitemap)
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ssr.SITE_URL}/sitemap.xml\n`)

  // Le code serveur ne sert qu'au build : on ne le publie pas.
  await rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })

  const fiches = ssr.LANG_CODES.map(
    (lang) => `${lang} ${data[lang].champions.filter((champion) => ssr.getFiche(champion.id, lang)).length}`,
  )
  console.log(
    `Pré-rendu : ${entries.length} pages en ${ssr.LANG_CODES.length} langues (patch ${version}, fiches : ${fiches.join(', ')}), sitemap.xml, robots.txt, 404.html en ${((Date.now() - started) / 1000).toFixed(1)} s`,
  )
}

main().catch((error) => {
  console.error(`\nÉchec du pré-rendu : ${error.message}\n`)
  process.exit(1)
})
