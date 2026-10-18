# skill-hints

A Claude Code mod that ranks your installed skills against each prompt you send and shows the top five in a toast, each with the words that matched.

- A quoted trigger phrase from a skill's description scores 6, a word from its name 3, any other description word 1.
- `/skill-hints <text>` ranks the skills against some text without sending it.

It is keyword matching, a rough stand-in for how Claude actually chooses a skill.

## Install

At the prompt of a terminal session:

```
/plugin install skill-hints --marketplace AgentBlackadder/skill-hints
```

Answer `y` to add the marketplace, then pick a scope.

From a shell:

```
claude plugin install skill-hints --marketplace AgentBlackadder/skill-hints
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `AgentBlackadder/skill-hints`, then Add plugin.

A private repository installs only for people who can read it on GitHub and whose machine already holds a git credential for github.com (an SSH key, or `gh auth login` then `gh auth setup-git`).
