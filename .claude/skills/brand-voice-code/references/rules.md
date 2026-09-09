# Rules

Derived from the voice already in `demos/readme.md` and the module readmes. Those files are the
reference sample; when a rule here and the existing prose disagree, the existing prose wins.

## Register

- Second person, present tense, active voice. "You connect the Angular CLI MCP server so agents
  read the real workspace." Never "the student will be able to".
- State what a thing does, not why it is exciting. No "powerful", "seamless", "modern approach to",
  "in today's world", "unlock", "leverage", "dive into", "game changer".
- Name the real API, flag, file or endpoint on first mention. `httpResource()`, `linkedSignal()`,
  `.claude/settings.json`, `POST /api/secrets/upload`. A sentence that could describe any framework
  is not carrying its weight.
- Assume the prerequisites in the module readme. Never re-teach `signal()` in module 9.
- Comparisons are concrete and one-directional: say what replaces what. "`httpResource()` instead
  of `toSignal(http.get(...))`", never "some developers prefer".

## Mechanics

- No em dashes. Use a comma, colon, semicolon or parentheses.
- Max 4 sentences per paragraph.
- Headings are verb-first where the section is an action ("Wire the proxy", "Expose the store as
  agent tools"), noun-phrase where it names a thing ("Demo app", "Anti-patterns"). Never `Overview`,
  `Introduction`, `Conclusion` or a bare gerund pile.
- Sentence case in headings. Product names keep their own casing: Angular, Vitest, Playwright,
  NgRx SignalStore, Claude Code, GitHub Copilot, WebMCP.
- Every code fence declares a language. Prompt blocks are ```text.
- Internal links are relative; anchors are `#heading-name`.
- Mermaid node labels are `"quoted<br/>labels"`, never `\n`.
- Tables carry data, not prose. A cell holding a subordinate clause that explains the value is a
  paragraph wearing a table.

## Structure

- Open a module or guide on the problem, in plain words, before any syntax.
- One capability per section. A section that teaches two things is two sections.
- Expected results are observable: what appears on screen, what the command prints, what the file
  now contains. Never "it should work".
- Cut anything the reader can get from the code: a bullet restating a file name adds nothing.

## Words to avoid

`simply`, `just`, `easy`, `obviously`, `of course`, `note that`, `it is important to`,
`best practice` used as an argument, `robust`, `seamless`, `powerful`, `cutting-edge`,
`in this section we will`, `let us`, `feel free to`.
