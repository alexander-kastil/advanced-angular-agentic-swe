# Angular Expert Agent

A subagent is a separate context with its own system prompt, tool grant and model. It keeps
subject-matter detail off the main thread and lets independent work run in parallel.

## Definition

`.claude/agents/angular-expert.md`:

```yaml
---
name: angular-expert
description: Angular 22 work: components, signals, routing, forms, testing. Use for any Angular change before writing code.
tools: Read, Edit, Write, Glob, Grep, Bash
model: inherit
---
```

Everything under the frontmatter is the system prompt of the agent.

| Field | Purpose |
| --- | --- |
| `name` | The address. This is what you type to route work to it. |
| `description` | The routing surface. It is read on every turn, so it must name the triggers, not summarize the agent. |
| `tools` | The allowlist. Anything absent cannot be called, whatever the prompt says. |
| `model` | `inherit`, or pin a cheaper or stronger model for this kind of work. |

## Grant the narrow tool set

Give the agent what the job needs and nothing more. An agent that only reviews does not need `Write`,
and dropping `Edit` and `Write` turns the same definition into a review agent without changing a word
of the prompt. A subagent cannot escalate its own permissions, so every mutation of a live or remote
system stays on the main thread by construction.

## Agent file or skill?

The agent file loads whenever the agent runs. A skill loads only when its description matches. Put a
rule in the wrong place and it is either a per-turn tax or silently absent.

| Goes in the agent file | Goes in a skill |
| --- | --- |
| Hard prohibitions ("never run `dotnet ef migrations`") | API signatures and when to use them |
| Behavioural contracts ("paste the command output, never say verified") | Long procedures such as wiring MSAL |
| The tool allowlist and the model | The anti-pattern table, which keeps growing |
| Which skill to load first | Everything the skill says |

The test: would you be upset to find this rule violated in a diff even though no skill matched? Then
it belongs in the agent file.

## Routing

| Prompt | Goes to | Why |
| --- | --- | --- |
| Migrate the customer list to `httpResource()` | `angular-expert` | Angular surface, the expert owns the conventions. |
| Why does `POST /customers` return 500? | `dotnet-expert` | Server side, different owner. |
| Rename this variable | main thread | Routing costs more than the edit. |
| Deploy the built app to the server | main thread | A subagent cannot escalate, so live mutations stay here. |

## The same agent in GitHub Copilot

Copilot calls them custom agents. The file lives in `.github/agents/` and ends in `.agent.md`; the
frontmatter carries the same ideas with a tool list instead of a comma string:

```yaml
---
name: angular-expert
description: Angular 22 work: components, signals, routing, forms, testing. Use for any Angular change before writing code.
tools: ['read', 'edit', 'search', 'execute']
model: Claude Opus 5.5
---
```

| | Claude Code | GitHub Copilot |
| --- | --- | --- |
| File | `.claude/agents/angular-expert.md` | `.github/agents/angular-expert.agent.md` |
| Select it | routed by description, or named in the prompt | agents dropdown in chat, `/agent` in the CLI, or as a subagent |
| Tool grant | `tools: Read, Edit, Write` | `tools: ['read', 'edit']` |
| Own context | yes, as a subagent | yes, when run as a subagent |

The design rules carry over unchanged: a narrow tool list, a description that names the triggers, hard
rules in the agent file and depth in a skill.

## When the work stays on the main thread

Read the agent file anyway. The hard rules and prohibited commands live there, not in `CLAUDE.md`,
which compresses each agent to a single row. Skipping the delegation silently drops the rules.
