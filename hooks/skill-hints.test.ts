import { expect, test } from 'claude-code/testing'

import { rank } from './score'

const skills = [
  { name: 'plugin-authoring', description: 'Make a mod: a change to Claude\'s own interface, such as a pane, a toast, a slash command, or a hook on tool calls or prompts.' },
  { name: 'searchfit-seo:seo-audit', description: 'Run a comprehensive SEO audit. Use when the user asks to "audit my site", "SEO health check".' },
  { name: 'anthropic-skills:pdf', description: 'Read, merge and split PDF files.' },
]

test('a mod request ranks plugin-authoring first', () => {
  const hints = rank('create a mod that shows a toast on each prompt', skills)
  expect(hints[0].name).toBe('plugin-authoring')
})

test('a quoted trigger phrase outranks loose words', () => {
  const hints = rank('can you audit my site please', skills)
  expect(hints[0].name).toBe('searchfit-seo:seo-audit')
  expect(hints[0].reason).toContain('"audit my site"')
})

test('nothing relevant gives no hints', () => {
  expect(rank('hello there', skills)).toEqual([])
})
