# Harden with Strict CSP

A Content Security Policy tells the browser which script it is allowed to execute. It is the control
that turns a successful injection into a blocked request instead of a breach.

## Let the builder generate it

```json
"architect": {
  "build": {
    "options": {
      "security": {
        "autoCsp": true
      }
    }
  }
}
```

With `autoCsp` the application builder hashes every script it emits into `index.html` and writes a
hash-based strict policy. There is nothing to keep in sync by hand, which is why hand-written policies
rot and this one does not.

The option is `false` by default while it is in preview. It accepts an object:

```json
"autoCsp": { "unsafeEval": true }
```

Only set `unsafeEval` if a dependency genuinely calls `eval` or `new Function`, and treat that as a
dependency to replace. It removes most of the protection the policy provides.

## What a strict policy contains

| Directive | Effect |
| --- | --- |
| `script-src 'strict-dynamic' 'sha256-...'` | Only the hashed scripts run, plus scripts they create themselves |
| `object-src 'none'` | Removes the plugin vector that bypasses script restrictions |
| `base-uri 'self'` | Stops an injected `<base>` tag from re-pointing every relative script URL |
| `require-trusted-types-for 'script'` | Assigning a raw string to `innerHTML` becomes a runtime error |

`'strict-dynamic'` is what makes this workable with a bundler: hashed entry scripts may load the chunks
they need, without every chunk needing its own entry in the policy.

## Report before you enforce

Ship `Content-Security-Policy-Report-Only` first with a `report-to` endpoint, collect for a release
cycle, fix what shows up, then switch to the enforcing header. Going straight to enforcement on a large
app breaks third-party widgets you had forgotten about.

## Watch violations in the app

```typescript
document.addEventListener('securitypolicyviolation', event => {
  console.warn(event.violatedDirective, event.blockedURI);
});
```

The demo logs these live. In production, forward them to your telemetry: a spike in violations is either
a broken deploy or an attack.

## Angular's own defences

CSP is a second layer. The first is Angular's sanitizer, which escapes interpolated values by default.
The way through it is `bypassSecurityTrustHtml` and friends on `DomSanitizer`, so treat every call site
as something a reviewer has to justify.

Trusted Types close the remaining gap: with `require-trusted-types-for 'script'` in the policy, any DOM
sink that takes a string throws unless the value came from a registered policy.

## Verify

```bash
npm run build
grep -i "content-security-policy" dist/optimize-angular/browser/index.html
```

The dev server does not emit a policy, so this demo shows no active policy until you inspect a
production build.
