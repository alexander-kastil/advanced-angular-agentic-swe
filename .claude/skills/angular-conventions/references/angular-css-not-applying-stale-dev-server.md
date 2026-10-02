# Cause 1: the dev server is serving a stale bundle

## Cause 1: the dev server is serving a stale bundle

A long-running `ng serve` can keep serving an hours-old bundle indefinitely. It survives Ctrl+Shift+R,
`location.reload()`, and touching the file to bump its mtime, because the staleness is server-side: the
watcher missed the change or a rebuild failed and the server kept the last good output. A concurrent
process writing into `src/` (another agent, another editor, a `run build` in the same tree) makes a
half-written file transiently unresolvable, which is enough to wedge the rebuild.

Confirm the source is actually correct before blaming the server, by checking the *production* output:

```bash
npm --prefix <app> run build
grep -rlo "flex:0 1 124px" dist/            # the new declaration, minified
grep -rlo "container-type:inline-size" dist/ # the old one should be gone
```

If `dist/` has the new CSS and the CSSOM has the old, it is the dev server. Restart it — same command,
same port; it is a localhost process and the restart is immediately reversible:

```bash
# find it, then restart with the original command
# Windows: Get-CimInstance Win32_Process -Filter "ProcessId=<pid>" | Select CommandLine
npm --prefix <app> start
```

Expect the restart to also pull in unrelated in-flight edits from other sessions in the same tree.
Re-read what changed on screen before attributing any of it to your own work.

## The commonest cause is not a stale watcher: the build is RED

Before any of the above, **read the dev server's own log**. A failed build and a stuck watcher are
indistinguishable from outside the process: `ng serve` keeps answering every request with HTTP 200
from its last good bundle and prints nothing to the browser. The log names the file, the line and the
error code; everything else is inference.

A run where three separate people diagnosed "stuck watcher" had four NG8022 errors in one settings
template. What made it survive every check:

- **`tsc --noEmit` exits 0**, because it does not type-check templates (see
  [angular-component-extraction](angular-component-extraction.md)). A clean tsc is not evidence the app
  builds, and it is the single most misleading signal here because it is the fastest one to run.
- **The unit suite passed 900 of 900**, because no spec instantiates that component. A component
  nothing instantiates has no template coverage at all; settings pages are the usual case.
- Hard reloads, cache-busted chunk fetches and touching a file to nudge the watcher all "confirmed"
  staleness, because a red build produces exactly that symptom.

One asymmetry does distinguish them without the log, and it is worth knowing when you only have the
browser: global `styles.css` can be current while a component's lazy chunk is stale, because they are
emitted by different parts of the build. Finding a recent global-CSS change served correctly does NOT
mean the server is healthy.

```bash
ng build          # the real template gate; ng serve's log says the same thing sooner
```

Restart only after the log has ruled the build green. Restarting a red build gives you a server that
cannot come up at all, which reads as a worse problem than the one you started with.

Back to the index: [angular-css-not-applying](angular-css-not-applying.md)
