# Audit Dependencies and Licenses

Shipping a bundle means shipping other people's code. Two obligations follow: know the licences you are
redistributing under, and know the vulnerabilities you are carrying.

## Attribution comes out of the build

`extractLicenses` is enabled by default in the production configuration, so every build writes:

```
dist/optimize-angular/browser/../3rdpartylicenses.txt
```

That file is the attribution notice. MIT, BSD and Apache-2.0 all require the licence text and copyright
notice to travel with the distributed code, and a link to that file from an about page satisfies it.

## Licence classes

| Class | Examples | What it means for a bundled dependency |
| --- | --- | --- |
| Permissive | MIT, BSD, ISC | Ship the licence text and the copyright notice |
| Permissive with patent grant | Apache-2.0 | Also ship `NOTICE` and state significant changes |
| Weak copyleft | MPL-2.0, LGPL | Modifications to the library's own files stay under that licence |
| Strong copyleft | GPL, AGPL | The combined work may have to be released under the same licence |
| No licence | absent `license` field | Default copyright: you have no right to redistribute it |

A copyleft licence on a build-time tool is harmless, since the tool is not distributed. On a runtime
dependency it is a legal decision, not an engineering one. Escalate it rather than deciding it.

## Commands

```bash
npm audit --omit=dev            # advisories in what you actually ship
npm ls --all --json             # the full resolved tree
npx license-checker --production --summary
npm run build                   # writes 3rdpartylicenses.txt
```

## In CI

- Fail on **new** high or critical advisories, not on a total count. A count that is already non-zero
  trains everyone to ignore the step.
- Commit the lockfile and review its diff. A transitive bump is how most supply-chain incidents arrive.
- Publish an SBOM (CycloneDX or SPDX) next to the release artifact. The EU Cyber Resilience Act makes
  this expected for products sold in the EU.
- Pin the toolchain, not just the libraries. A compromised build tool has the same reach as a compromised
  runtime dependency.

## Reduce the surface

The cheapest audit is the one with less to audit. A dependency that saves twenty lines is rarely worth
its transitive tree, its licence, its advisories and its bytes. `moment` in this app is the example: it
is deprecated upstream, does not tree shake, and everything it does here is available from `Intl`.
