export type Skill = { name: string; description: string }
export type Hint = { name: string; score: number; reason: string }

const STOP = new Set(
  'the and for with this that you your use when want what from have has into are was can will about any all its not but how out get make just like use using used them they some more also one see'.split(' '),
)

const stem = (w: string) => w.replace(/(ings?|ed|es|s)$/, '')

const words = (text: string) =>
  (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(w => w.length >= 3 && !STOP.has(w))

// Quoted phrases in a description are usually its trigger phrases ("audit my site").
const phrases = (description: string) =>
  [...description.matchAll(/["“]([^"”]{3,60})["”]/g)].map(m => m[1].toLowerCase())

export function rank(prompt: string, skills: readonly Skill[], top = 5): Hint[] {
  const lower = prompt.toLowerCase()
  const asked = new Set(words(prompt).map(stem))
  if (asked.size === 0) return []

  const hints: Hint[] = []
  for (const skill of skills) {
    const hits: string[] = []
    let score = 0

    for (const phrase of phrases(skill.description)) {
      if (lower.includes(phrase)) {
        score += 6
        hits.push(`"${phrase}"`)
      }
    }
    const nameWords = new Set(words(skill.name.replace(/[:_-]/g, ' ')).map(stem))
    for (const w of nameWords) {
      if (asked.has(w)) {
        score += 3
        hits.push(`name:${w}`)
      }
    }
    const descWords = new Set(words(skill.description).map(stem))
    for (const w of descWords) {
      if (asked.has(w) && !nameWords.has(w)) {
        score += 1
        hits.push(w)
      }
    }
    if (score >= 2) hints.push({ name: skill.name, score, reason: hits.slice(0, 4).join(', ') })
  }

  return hints.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).slice(0, top)
}

export const format = (hints: readonly Hint[]) =>
  hints.length === 0
    ? 'No skill stands out for this prompt.'
    : 'Skills for this prompt:\n' +
      hints.map((h, i) => `${i + 1}. /${h.name} (${h.score}) matched ${h.reason}`).join('\n')
