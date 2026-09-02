# Agent Skills

A skill is knowledge the agent loads when it needs it, instead of carrying on every turn. Two kinds
matter in an Angular repo, and they are not competitors.

## The official Angular Agent Skills

The Angular team maintains a collection at `github.com/angular/skills`, documented on
angular.dev/ai/agent-skills:

| Skill | What it does |
| --- | --- |
| `angular-developer` | Generates Angular code and gives architectural guidance on signals, `linkedSignal`, `resource`, forms, DI, routing, SSR, accessibility, animations, styling, testing and CLI tooling. |
| `angular-new-app` | Creates a new app through the Angular CLI and sets up a modern project structure. |

Install them with a community tool such as `skills.sh`:

```bash
npx skills add https://github.com/angular/skills
```

They are updated with the framework, so they are the right answer for anything that is framework
truth.

## This repository's own skill

`.claude/skills/angular-conventions/` is the house skill. It carries what no framework skill can
know: that this class chose NgRx Signal Store, that OnPush must never be written explicitly here,
how the Vitest setup is wired, what `interaction_in_progress` means in the MSAL flow, and the fix for
the data table that shifts on sort. Each of those lives in its own `references/*.md`.

## Which one wins

| Question | Winner | Why |
| --- | --- | --- |
| What is the signature of `httpResource()` in v22? | official | Framework truth. It tracks the release, your notes drift. |
| Scaffold a new app for module 09. | official | `angular-new-app` knows the current CLI flags. |
| Which state library do we use here? | house | A repo decision. No framework skill can know it. |
| The data table shifts when a column is sorted. | house | A bug this codebase already paid for once. |
| Never emit `ChangeDetectionStrategy.OnPush`. | house | The framework says it is the default; the ban is yours. |

Run both. The framework skill answers *how does Angular work*, the house skill answers *how do we
work*.

## Shape

```
.claude/skills/angular-conventions/
  SKILL.md
  references/components.md
  references/signals.md
  references/testing.md
```

`SKILL.md` carries YAML frontmatter:

```yaml
---
name: angular-conventions
description: Angular 22 conventions for components, signals, DI and testing. Triggers on standalone component, inject(), httpResource(), signal forms.
---
```

## The description does the routing

Only the description is in context on every turn. A skill with no description can never be chosen,
and a description that reads like a summary rather than an index entry will not fire on the phrases
users actually type. Name the triggers.

## Keep the body thin

`SKILL.md` routes, `references/*.md` hold the detail. The body should tell the agent which single
reference to open, never invite it to read them all.

## Where they live

- `.claude/skills/` in the repo, committed, shared with the team.
- `~/.claude/skills/` global, available in every project.

Keep the two reconciled in both directions so a fix made in one project reaches the others.
