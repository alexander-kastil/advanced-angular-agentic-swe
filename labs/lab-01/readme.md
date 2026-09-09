# Build the Secrets and Document Vault Workbench

An agent that has not been told where the API is, what the domain looks like or which colors
the product uses will guess all three, and every guess costs you a review round. In this lab you
give the agent the repository itself: five MCP servers, harness files carrying the project's
facts, a design system it can read, a subagent that owns Angular work and a hook that refuses
legacy syntax. What you hold at the end is a running Angular 22 workbench showing the five
secret lists, built by that setup rather than by hand.

------

The harness lives once, at the repository root: `CLAUDE.md`, `AGENTS.md`, `.mcp.json` and
`.claude/`. Every lab uses that one harness, so run `claude` from the repository root and keep
`npm` commands in the app folder. You need Docker running and Node 22 or later; step 3 installs
one more skill. The finished app sits in
[`l01-secrets-vault-solution/`](./l01-secrets-vault-solution/).

---

## Step 1: Scaffold the workbench

Overview: `ng new` offers to write a per-project agent harness. This repository already keeps
one at its root, so you take the app and leave the harness behind, which is also the fastest way
to see what agent configuration a fresh Angular project ships with.

Recipe: run this from `labs/lab-01/` in a terminal.

```bash
npx -y @angular/cli@22 new l01-secrets-vault --style=css --ssr=false --zoneless --ai-config claude-code vscode --skip-git --defaults
```

Now start the session at the repository root, not in the app folder, because that is where the
harness is discovered from:

```bash
cd ../..
claude
```

```text
Read labs/lab-01/l01-secrets-vault/CLAUDE.md, AGENTS.md, .mcp.json and .vscode/mcp.json, which
ng new generated inside the app. Tell me which of them are byte identical and which tool
reads each one. Then compare their rules against the repository root CLAUDE.md and list only the
rules the generated file has that the root file does not. Delete all four generated files
afterwards; this repository keeps one harness at its root. Finally call the Angular CLI MCP
server's list_projects tool and show me the project name and the build target it reports.
```

Expected Outcome: `ng new` prints `CREATE l01-secrets-vault/CLAUDE.md`, `AGENTS.md`, `.mcp.json`
and `.vscode/mcp.json` among the created files. The agent reports that `CLAUDE.md` and
`AGENTS.md` are byte identical, that `.mcp.json` is read by Claude Code and `.vscode/mcp.json`
by VS Code, and that both register `angular-cli` over stdio. All four are gone from the app
folder afterwards. `list_projects` scans the whole repository and reports every course workspace,
with `l01-secrets-vault` among them on the `@angular/build:application` builder.

---

## Step 2: Register the workbench's MCP servers

Overview: the root `.mcp.json` already registers `angular-cli`, `chrome-devtools` and
`playwright`. Two more turn the agent from a code writer into something that can read the live
API and work the repository's issues and pull requests. The vault server's API key also decides
which of its tools the agent sees, so this file is where you scope what the agent may touch.

Build and start the vault container from the repository root, which is also where the Dockerfile
expects to run because it copies `labs/secrets-vault-mcp/` and `db/secrets-vault-mcp/`:

```bash
docker build -f labs/secrets-vault-mcp/Dockerfile -t secrets-vault-mcp:local .
docker run -d --name secrets-vault -p 5093:5093 -e Mcp__ApiKeys__0__Name=angular-lab -e Mcp__ApiKeys__0__Key=lab-secrets-vault-key -e Mcp__ApiKeys__0__Grants__0=secrets-mcp/lists -e Mcp__ApiKeys__0__Grants__1=secrets-mcp/secrets secrets-vault-mcp:local
curl http://localhost:5093/health
```

The GitHub server authenticates with a personal access token read from the environment, so put
one there before you start the session:

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token)
```

Then add these two entries to `mcpServers` in the root `.mcp.json`, beside the three already
there. Both transports are now in one file: `angular-cli`, `chrome-devtools` and `playwright`
are processes the client spawns over stdio, while `secrets-vault` and `github` are HTTP
endpoints it calls with a header. `${...}` in a header is expanded from the environment, which
is what keeps the token out of the file.

```json
{
  "secrets-vault": {
    "type": "http",
    "url": "http://localhost:5093/mcp",
    "headers": {
      "X-API-Key": "lab-secrets-vault-key"
    }
  },
  "github": {
    "type": "http",
    "url": "https://api.githubcopilot.com/mcp/",
    "headers": {
      "Authorization": "Bearer ${GITHUB_PERSONAL_ACCESS_TOKEN}"
    }
  }
}
```

Restart `claude` and approve the new project servers when it asks. Then write what the agent
learned into the harness:

Recipe:

```text
Call the secrets-vault MCP server's list_secret_lists tool. Then read the C# records in
labs/secrets-vault-mcp/Contracts/SecretListContracts.cs and SecretContracts.cs.

Append a "Secrets and Document Vault" section to the repository root CLAUDE.md holding, as a
table: the lab app path labs/lab-NN/lNN-secrets-vault-starter, the API base (/api, proxied to
http://localhost:5093 by the app's proxy.conf.json), that the domain model comes from the C#
records in labs/secrets-vault-mcp/Contracts/, the fields GET /api/lists returns, and which
numeric type value means Secrets and which means Vault. Add a "Rules for the lab workbench"
section stating that every TypeScript interface is derived from the matching C# record, that
components style themselves from CSS custom properties rather than raw hex values, that
scaffolding goes through ng generate, and that nothing under labs/secrets-vault-mcp/ or
db/secrets-vault-mcp/ is ever edited. Values only in the table cells, no explanatory sentences.
Then copy CLAUDE.md over AGENTS.md so the two stay identical.
```

Expected Outcome: `curl` returns `Healthy`, and `claude mcp list` reports all five servers
connected:

```text
playwright: npx @playwright/mcp@latest --vision - Connected
chrome-devtools: npx -y chrome-devtools-mcp@latest - Connected
angular-cli: npx -y @angular/cli mcp - Connected
secrets-vault: http://localhost:5093/mcp (HTTP) - Connected
github: https://api.githubcopilot.com/mcp/ (HTTP) - Connected
```

`/mcp` shows `secrets-vault` holding nine tools, all of them about lists and secrets. The
category, app and box tools that the server also defines are absent, because the key you passed
carries only the `secrets-mcp/lists` and `secrets-mcp/secrets` grants. `CLAUDE.md` and
`AGENTS.md` both end with the new sections and `git diff` shows the same addition in each.

If `github` reports `does not support dynamic client registration`, the header is missing its
token: the export above must happen in the shell that starts `claude`.

---

## Step 3: Generate the design system

Overview: twelve labs of UI need one palette, one type scale and one spacing rhythm decided
once. A design skill produces those from the product category instead of from taste, and writes
them to a file every later lab reads.

Install the skill globally so all twelve labs can use it, then run it:

```bash
npx -y ui-ux-pro-max-cli@latest init --ai claude --global
```

Research:

```text
Use the ui-ux-pro-max skill to propose a design system for a credential and document manager:
secret lists, secrets with masked passwords, categories and vault files. Desktop-first internal
tool, dense data lists, light and dark. Show me the category it matched, the palette, the font
pairing and the spacing scale, and tell me which parts of its output do not apply to an internal
tool.
```

Finding: the skill returns a matched product category, a named style, a full palette with roles
and CSS variable names, a font pairing with a Google Fonts URL, and a spacing table. Check three
things before accepting it. The category should be a password manager or a security tool rather
than a generic SaaS site, and if it comes back as something unrelated, narrow the query rather
than editing the colors by hand.

The palette should carry a distinct destructive color and a muted foreground, because a
credential list needs both. And the returned page pattern is written for a marketing landing
page, with a hero, proof logos and a call to action; none of that belongs in an internal tool,
so it is the one part of the output you drop.

Recipe:

```text
Persist the design system it proposed, using the ui-ux-pro-max skill's --persist flag,
project name "Secrets and Document Vault", density 8 and variance 2, with the repository root as
the output directory. All twelve labs read it from there.

Then write labs/lab-01/l01-secrets-vault/src/styles.css so it holds every color, font, spacing,
shadow and radius token from the generated MASTER.md as CSS custom properties on :root, imports
the two Google Fonts, sets body to the background, foreground and body font, gives headings the
heading font, defines a visible :focus-visible outline using the ring color, and honors
prefers-reduced-motion. No component rules in this file.
```

Expected Outcome: `design-system/secrets-and-document-vault/MASTER.md` exists at the repository
root and carries a color table, a typography section, a spacing table sized for a dashboard and
a list of anti-patterns. The app's `src/styles.css` grows from its one generated comment line to
a `:root` block whose variable names match the MASTER.md table row for row:

```text
| Primary | #1E3A5F | --color-primary |   ->   --color-primary: #1e3a5f;
```

---

## Step 4: Build the secret lists screen through a subagent

Overview: a subagent is a separate session with its own instructions and its own tool list. Give
one the Angular rules and the two files that are authoritative here, and the screen it returns
needs no correction round about fields or colors.

Recipe:

```text
Create .claude/agents/angular-expert.md at the repository root, a subagent named angular-expert
for Angular 22 work on the lab workbench. Its description must say it handles components,
signals, httpResource, routing, Signal Forms, SignalStore and Vitest specs, and that it reads
the C# records in labs/secrets-vault-mcp/Contracts/ for the domain model and
design-system/secrets-and-document-vault/MASTER.md for tokens. Give it Read, Write, Edit, Glob,
Grep and Bash. Its body instructs it to read CLAUDE.md first, scaffold with ng generate, style
only from the custom properties in the app's src/styles.css, and finish by running npm run build
from the app folder.

Then delegate to it: build the secret lists screen in labs/lab-01/l01-secrets-vault. Add
proxy.conf.json forwarding /api to http://localhost:5093 and register it as the serve target's
proxyConfig in angular.json. Derive a SecretList interface and a SecretListType enum from
SecretListContracts.cs. Generate a SecretLists component that loads GET /api/lists with
httpResource, splits the result into a Secrets group and a Vault group with computed(), and
renders each group as a card grid showing name, description and count, with loading and error
states. Provide the HTTP client in app.config.ts, render the component from app.html under an h1
reading "Secrets and Document Vault", and set the same text as the document title.
```

Expected Outcome: the subagent reports a clean `npm run build`. Start the app with `npm start`
from `labs/lab-01/l01-secrets-vault` and `http://localhost:4200` shows two headed groups:

```text
Secrets   Cloud Provider Keys (7)  Training Logins (7)  CI/CD Credentials (6)
Vault     Team Documents (5)       Deployment Certificates (3)
```

The browser console is empty and the network tab shows one request to `/api/lists`, not to
`localhost:5093`, because the dev server proxies it.

---

## Step 5: Block the legacy Angular APIs with a hook

Overview: `CLAUDE.md` lists the APIs this course does not use, and an agent will still reach for
`*ngIf` when it is quoting an older answer. A hook turns that list into a gate the model cannot
talk its way past, because it runs before the edit lands.

Recipe:

```text
Create .claude/hooks/no-legacy-angular.sh at the repository root, a PreToolUse hook that reads
the tool payload from stdin, extracts tool_input.file_path, and exits 0 immediately unless that
path ends in .ts or .html. It then exits 0 unless the path has a labs path segment, because the
demos under demos/ teach these APIs deliberately and must stay editable. Otherwise it scans the
payload for *ngIf, *ngFor, *ngSwitch, @Input(), @Output(), ngClass, ngStyle, @HostBinding,
@HostListener and standalone: true. On a match it prints the file and the matched patterns to
stderr and exits 2; otherwise it exits 0.

The path arrives with Windows backslashes about as often as with forward slashes, so match the
separator with a bracket class rather than naming either one. Comment only the lines a reader
cannot decode at a glance.

Then register it in .claude/settings.json as a PreToolUse hook matching Write|Edit, invoked as
bash .claude/hooks/no-legacy-angular.sh. That file already holds a permissions block, so add the
hook to it rather than replacing it.
```

Prove it fails before trusting it to pass. Run all three payloads from the repository root:

```bash
echo '{"tool_name":"Write","tool_input":{"file_path":"labs/lab-01/l01-secrets-vault/src/app/x.html","content":"<div *ngIf=\"ok\">hi</div>"}}' | bash .claude/hooks/no-legacy-angular.sh; echo "exit=$?"
echo '{"tool_name":"Write","tool_input":{"file_path":"labs/lab-01/l01-secrets-vault/src/app/x.ts","content":"name = input.required<string>();"}}' | bash .claude/hooks/no-legacy-angular.sh; echo "exit=$?"
echo '{"tool_name":"Write","tool_input":{"file_path":"demos/03-components/x/src/app/y.html","content":"<div *ngIf=\"ok\">hi</div>"}}' | bash .claude/hooks/no-legacy-angular.sh; echo "exit=$?"
```

Expected Outcome: the first prints the file name and `*ngIf` to stderr and reports `exit=2`. The
second and third print nothing and report `exit=0`, the third because it is a demo rather than a
lab. Restart `claude`, ask it to add `<p *ngIf="true">x</p>` to the app's `src/app/app.html`, and
the edit is refused with the hook's message rather than applied:

```text
PreToolUse:Edit hook error: [bash .claude/hooks/no-legacy-angular.sh]: Legacy Angular API in
...\labs\lab-01\l01-secrets-vault\src\app\app.html: *ngIf . See the anti-pattern table in CLAUDE.md.
```

---

## Next

Lab 2 starts from this workbench and replaces the single `httpResource` call with the full
signals API: the secrets inside a list, a debounced search over `?search=`, and mask and reveal
as signal state.
