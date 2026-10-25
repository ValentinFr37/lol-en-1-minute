// Métadonnées de chaque page (titre, description, partage, données structurées).
// Utilisé au pré-rendu pour écrire le <head>, et dans l'app pour le titre de l'onglet.

import { imageUrl } from './ddragon.js'
import { routePath } from './router.js'
import { isFeminine } from './genre.js'
import { DEFAULT_LANG, LANGS, LANG_CODES, t } from '../i18n.js'

const env = import.meta.env ?? {}
export const SITE_URL = (env.VITE_SITE_URL || 'https://lol-en-1-minute.vercel.app').replace(/\/$/, '')
export const SITE_NAME = 'LoL en 1 minute'
const AUTHOR = 'ValentinFr37'

// Coupe proprement un texte à `max` caractères, sur un mot.
export function truncate(text, max = 155) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.]+$/, '') + '…'
}

// Les touches de sort s'écrivent seules dans les fiches (« son E ») : on les rend explicites.
const describeKeys = (text) => text.replace(/(?<![\p{L}\d'’-])([QWER])(?![\p{L}\d'’-])/gu, '($1)').replace(/\(\((\w)\)\)/g, '($1)')

export function championTitle(champion, fiche = null, lang = DEFAULT_LANG) {
  return `${t(lang).seoChampionTitle(champion.name, isFeminine(fiche))} | ${SITE_NAME}`
}

// Adresses de la même page dans chaque langue (balises hreflang et sitemap).
export function alternates(route) {
  return LANG_CODES.map((code) => ({ lang: code, href: `${SITE_URL}${routePath(route, code)}` }))
}

export function pageMeta({ route, champion = null, fiche = null }) {
  const lang = route.lang ?? DEFAULT_LANG
  const text = t(lang)
  const base = { lang, ogLocale: LANGS[lang].og }
  const homeUrl = `${SITE_URL}${routePath({ name: 'home' }, lang)}`

  if (route.name === 'home') {
    return {
      ...base,
      title: text.seoHomeTitle,
      description: text.seoHomeDescription,
      canonical: homeUrl,
      alternates: alternates(route),
      type: 'website',
      robots: 'index,follow',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: homeUrl,
          inLanguage: lang,
          description: text.seoHomeDescription,
        },
      ],
    }
  }

  if (route.name === 'champion' && champion) {
    const url = `${SITE_URL}${routePath(route, lang)}`
    const roles = champion.roles.map((role) => text.roles[role] ?? role).join(', ').toLowerCase()
    const description = fiche
      ? truncate(text.seoChampionDescription(champion.name, roles, describeKeys(fiche.contrer[0])))
      : truncate(text.seoChampionFallback(champion.name, champion.title, roles))

    const page = {
      '@context': 'https://schema.org',
      '@type': fiche ? 'Article' : 'WebPage',
      ...(fiche
        ? { headline: text.seoHeadline(champion.name), author: { '@type': 'Person', name: AUTHOR } }
        : { name: `${champion.name} | ${SITE_NAME}` }),
      description,
      url,
      inLanguage: lang,
      image: imageUrl.splash(champion.id),
      about: { '@type': 'Thing', name: `${champion.name} (League of Legends)` },
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: homeUrl },
    }

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: homeUrl },
        { '@type': 'ListItem', position: 2, name: champion.name, item: url },
      ],
    }

    return {
      ...base,
      title: championTitle(champion, fiche, lang),
      description,
      canonical: url,
      alternates: alternates(route),
      type: fiche ? 'article' : 'website',
      image: imageUrl.splash(champion.id),
      imageAlt: text.seoImageAlt(champion.name),
      robots: 'index,follow',
      jsonLd: [page, breadcrumb],
    }
  }

  return {
    ...base,
    title: `${text.seoNotFound} | ${SITE_NAME}`,
    description: text.seoHomeDescription,
    canonical: null,
    alternates: [],
    type: 'website',
    robots: 'noindex,follow',
    jsonLd: [],
  }
}

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// JSON dans une balise <script> : on neutralise "</script>" et les caractères piégeux.
export const safeJson = (value) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')

export function renderHead(meta) {
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="robots" content="${meta.robots}" />`,
    meta.canonical && `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
    ...(meta.alternates ?? []).map(
      (alt) => `<link rel="alternate" hreflang="${alt.lang}" href="${escapeHtml(alt.href)}" />`,
    ),
    meta.alternates?.length &&
      `<link rel="alternate" hreflang="x-default" href="${escapeHtml(meta.alternates.find((alt) => alt.lang === DEFAULT_LANG).href)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="${meta.ogLocale ?? 'fr_FR'}" />`,
    ...LANG_CODES.filter((code) => LANGS[code].og !== meta.ogLocale).map(
      (code) => `<meta property="og:locale:alternate" content="${LANGS[code].og}" />`,
    ),
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    meta.canonical && `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`,
    meta.image && `<meta property="og:image" content="${escapeHtml(meta.image)}" />`,
    meta.image && `<meta property="og:image:width" content="1215" />`,
    meta.image && `<meta property="og:image:height" content="717" />`,
    meta.imageAlt && `<meta property="og:image:alt" content="${escapeHtml(meta.imageAlt)}" />`,
    `<meta name="twitter:card" content="${meta.image ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    meta.image && `<meta name="twitter:image" content="${escapeHtml(meta.image)}" />`,
    ...meta.jsonLd.map((data) => `<script type="application/ld+json">${safeJson(data)}</script>`),
  ]
  return tags.filter(Boolean).join('\n    ')
}
