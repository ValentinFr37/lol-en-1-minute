// Métadonnées de chaque page (titre, description, partage, données structurées).
// Utilisé au pré-rendu pour écrire le <head>, et dans l'app pour le titre de l'onglet.

import { imageUrl } from './ddragon.js'
import { championPath } from './router.js'
import { pronoms } from './genre.js'

const env = import.meta.env ?? {}
export const SITE_URL = (env.VITE_SITE_URL || 'https://lol-en-1-minute.vercel.app').replace(/\/$/, '')
export const SITE_NAME = 'LoL en 1 minute'
const AUTHOR = 'ValentinFr37'

const HOME_TITLE = 'LoL en 1 minute : comment contrer chaque champion de League of Legends'
const HOME_DESCRIPTION =
  "Forces, faiblesses et conseils pour battre n'importe quel champion de League of Legends, à lire pendant l'écran de chargement. Pensé pour les débutants, en français."

// Coupe proprement un texte à `max` caractères, sur un mot.
export function truncate(text, max = 155) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.]+$/, '') + '…'
}

// Les touches de sort s'écrivent seules dans les fiches (« son E ») : on les rend explicites.
const describeKeys = (text) => text.replace(/(?<![\p{L}\d'’-])([QWER])(?![\p{L}\d'’-])/gu, '($1)').replace(/\(\((\w)\)\)/g, '($1)')

export function championTitle(champion, fiche = null) {
  return `${champion.name} : comment ${pronoms(fiche).cod} contrer en 1 minute | ${SITE_NAME}`
}

export function pageMeta({ route, champion = null, fiche = null }) {
  if (route.name === 'home') {
    return {
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      canonical: `${SITE_URL}/`,
      type: 'website',
      robots: 'index,follow',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          inLanguage: 'fr',
          description: HOME_DESCRIPTION,
        },
      ],
    }
  }

  if (route.name === 'champion' && champion) {
    const url = `${SITE_URL}${championPath(champion.id)}`
    const roles = champion.roles.join(', ').toLowerCase()
    const description = fiche
      ? truncate(
          `Comment battre ${champion.name} (${roles}) en 1 minute : le sort à surveiller, ses forces, ses faiblesses. ${describeKeys(fiche.contrer[0])}`,
        )
      : truncate(
          `${champion.name}, ${champion.title} (${roles}) : ses sorts résumés en français et des conseils pour l'affronter, à lire pendant l'écran de chargement.`,
        )

    const page = {
      '@context': 'https://schema.org',
      '@type': fiche ? 'Article' : 'WebPage',
      ...(fiche
        ? { headline: `Comment contrer ${champion.name} en 1 minute`, author: { '@type': 'Person', name: AUTHOR } }
        : { name: `${champion.name} en 1 minute` }),
      description,
      url,
      inLanguage: 'fr',
      image: imageUrl.splash(champion.id),
      about: { '@type': 'Thing', name: `${champion.name} (League of Legends)` },
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/` },
    }

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: champion.name, item: url },
      ],
    }

    return {
      title: championTitle(champion, fiche),
      description,
      canonical: url,
      type: fiche ? 'article' : 'website',
      image: imageUrl.splash(champion.id),
      imageAlt: `Illustration officielle de ${champion.name}`,
      robots: 'index,follow',
      jsonLd: [page, breadcrumb],
    }
  }

  return {
    title: `Page introuvable | ${SITE_NAME}`,
    description: HOME_DESCRIPTION,
    canonical: null,
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
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="fr_FR" />`,
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
