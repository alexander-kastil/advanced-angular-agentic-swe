# Hooks and Quality Gates

Instructions are advice. Hooks are enforcement: the harness runs them, so the rule holds whatever the
model decides.

## Events

| Event | Fires | Can block | Typical gate |
| --- | --- | --- | --- |
| `PreToolUse` | Before a tool call. | yes | Deny a banned API, deny a commit, deny writes outside a folder. |
| `PostToolUse` | After a write succeeds. | no | Format, lint or type check the file that changed. |
| `UserPromptSubmit` | Before the model sees the prompt. | yes | Inject context, name the owning agent. |
| `Stop` | When the agent wants to finish. | yes | Refuse to end on a red build. |

## Three gates that matter for Angular work

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "node .claude/hooks/block-banned-api.mjs" }]
      },
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "node .claude/hooks/deny-git-commit.mjs" }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "npx prettier --write \"$CLAUDE_FILE_PATHS\"" }]
      }
    ],
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "npm run build --prefix demos/01-agentic-dev/ng-agentic" }
        ]
      }
    ]
  }
}
```

`matcher` is a regex over tool names and is omitted for events that have no tool.

## Blocking a banned API

The hook reads the tool call as JSON on stdin, looks at what is about to be written, and exits 2 to
refuse it. Everything it prints to stderr is handed back to the model as the reason, so say what to
write instead:

```js
#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const BANNED = [
  [/standalone:\s*true/, 'standalone: true is the default since v20'],
  [/changeDetection:\s*ChangeDetectionStrategy\.OnPush/, 'OnPush is the default since v22'],
  [/\*ng(If|For|Switch)/, 'use @if / @for / @switch'],
  [/@(Input|Output)\(/, 'use input() / output()'],
  [/@Host(Binding|Listener)\(/, 'use the host object'],
  [/\[ng(Class|Style)\]/, 'use [class.x] and [style.x] bindings'],
  [/withXhr\(/, 'fetch is the v22 default'],
  [/new BehaviorSubject/, 'use signal() for local state']
];

const payload = JSON.parse(readFileSync(0, 'utf8'));
const text = payload.tool_input?.content ?? payload.tool_input?.new_string ?? '';

const hits = BANNED.filter(([pattern]) => pattern.test(text));
if (hits.length) {
  console.error('Banned API in this write:');
  for (const [, reason] of hits) console.error('- ' + reason);
  process.exit(2);
}
process.exit(0);
```

The same list already exists as prose in the harness file. The difference is that this version cannot
be forgotten.

## Exit codes

`0` allows. `2` blocks and feeds stderr back to the model as the reason. Any other non-zero value is
surfaced as an error **without blocking**, which is the usual cause of a hook that looks wired but
never gates anything.

## Hooks in GitHub Copilot

The Copilot CLI and the Copilot coding agent read hooks from `.github/hooks/*.json`. The events are
camelCase and a command gets a `bash` and a `powershell` variant:

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      { "type": "command", "bash": "node .github/hooks/block-banned-api.mjs", "timeoutSec": 10 }
    ],
    "postToolUse": [
      { "type": "command", "bash": "npx prettier --write .", "timeoutSec": 30 }
    ]
  }
}
```

A `preToolUse` hook refuses a call by printing
`{"permissionDecision":"deny","permissionDecisionReason":"use input() / output()"}` on stdout, so the
banned API script above needs only a different exit path. VS Code agent hooks use the Claude Code event
names and also read `.claude/settings.json`, so the gates written above apply in Copilot Chat as well.

| | Claude Code | GitHub Copilot CLI and coding agent |
| --- | --- | --- |
| File | `.claude/settings.json` | `.github/hooks/*.json` |
| Before a tool | `PreToolUse` | `preToolUse` |
| After a tool | `PostToolUse` | `postToolUse` |
| Prompt submitted | `UserPromptSubmit` | `userPromptSubmitted` |
| Block | exit `2`, reason on stderr | `permissionDecision: "deny"` on stdout |

## The rule of thumb

If a rule matters enough that you would be upset to find it violated in a diff, it belongs in a hook.
If it is a preference, leave it in the harness file.
