// Outils texte pour nettoyer les descriptions de Data Dragon,
// qui contiennent du pseudo-HTML (<br>, <magicDamage>, <status>…).

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' }

export function stripTags(html = '') {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m])
    .replace(/\s+/g, ' ')
    .trim()
}

// Première phrase d'un texte, tronquée proprement si elle reste trop longue.
export function firstSentence(text = '', max = 160) {
  const clean = stripTags(text)
  const match = clean.match(/^.+?[.!?](?=\s|$)/)
  const sentence = match ? match[0] : clean
  if (sentence.length <= max) return sentence
  const cut = sentence.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:]$/, '') + '…'
}

// Découpe un texte rédigé en repérant les touches de sort citées seules
// (« son E », « (Q) ») : ["Ne reste pas à portée de son ", { key: "E" }, "."]
const KEY_PATTERN = /(?<![\p{L}\d'’-])([QWER])(?![\p{L}\d'’-])/u

export function splitSpellKeys(text = '') {
  return text
    .split(new RegExp(KEY_PATTERN.source, 'gu'))
    .map((part, index) => (index % 2 === 1 ? { key: part } : part))
    .filter((part) => part !== '')
}
