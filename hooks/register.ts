import type { CommandInfo, Register } from 'claude-code'

import { format, rank } from './score'

// Skills reach the session as slash commands; built-ins are not skills.
const skillsOf = (commands: readonly CommandInfo[]) =>
  commands.filter(c => c.source !== 'builtin' && c.name !== 'skill-hints')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'skill-hints',
      description: 'Rank the skills against some text without sending it',
      argumentHint: '<prompt text>',
      immediate: true,
    })

    return next(e)
  })

  on('command.run', { command: 'skill-hints' }, async ($, e) => {
    const hints = rank(e.args, skillsOf(await $.command.list()))

    return { text: format(hints) }
  })

  on('prompt.submit', async ($, e, next) => {
    if (!e.command && !e.isMeta) {
      // Never hold up the prompt over a hint.
      const commands = await $.command.list().catch(() => [])
      const hints = rank(e.text, skillsOf(commands))
      if (hints.length > 0) $.ui.toast(format(hints), { timeoutMs: 8000 })
    }

    return next(e)
  })
}
