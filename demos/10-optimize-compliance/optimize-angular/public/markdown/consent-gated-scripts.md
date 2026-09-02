# Load Scripts After Consent

## The request is the violation

The DSGVO and the ePrivacy rules do not judge your banner. They judge what the browser asked for. A
vendor `<script src="https://vendor.example/tag.js">` in `index.html` has already sent the visitor's IP
address, user agent and referrer before your consent dialog has rendered a single pixel. Nothing you do
afterwards undoes that request.

So the gate cannot be logic wrapped around the vendor. The gate has to be the absence of the tag.

```
banner shown -> user accepts -> tag created -> request sent
```

Never:

```
tag in index.html -> request sent -> banner shown -> user declines -> too late
```

## The pattern

Keep consent in a signal, keep the vendor list as data, and inject from a service.

```ts
private document = inject(DOCUMENT);

grant(vendor: Vendor) {
  this.granted.update(state => ({ ...state, [vendor.key]: true }));
  this.persist();

  const script = this.document.createElement('script');
  script.id = `vendor-${vendor.key}`;
  script.src = vendor.src;
  script.async = true;
  script.onload = () => this.loaded.update(s => ({ ...s, [vendor.key]: true }));
  this.document.head.appendChild(script);
}
```

Three things this deliberately does not do:

- It does not render the script tag from a template. A template that can emit a script tag is a template
  you have to audit forever.
- It does not ask the vendor's own snippet to respect a flag. Vendor snippets change without a version bump.
- It does not use `eval` or `innerHTML`. Both are blocked by a strict CSP, and both are how consent
  gating turns into an XSS incident.

## Proving it

The demo reads the browser's own resource timeline:

```ts
const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
const match = entries.filter(entry => entry.name.includes(vendor.src)).pop();
```

An empty evidence table is the proof. Before consent there is no entry, because there was no request.
Reviewers can check the same thing without your code: DevTools, Network tab, filter JS, reload with
consent denied. If a vendor host appears, the gate is not real.

The three vendors in the demo are local stub files under `public/vendor/`. Nothing contacts a real third
party, but the injection, the network request and the side effects are genuine, which is what makes the
withdrawal problem visible.

## Withdrawal is the hard half

Granting is one line. Withdrawing is three problems.

| What was created | Can you undo it? |
| --- | --- |
| The `<script>` element | Yes, `remove()` it, so it will not load again |
| Cookies the vendor set | Yes, expire them by name and path |
| `localStorage` / `sessionStorage` keys | Yes, if you know the key names |
| Globals the script defined | No. `window.demoAnalytics` stays until the document is replaced |
| Listeners it registered on `document` | No, not unless the vendor exposes a teardown |
| Timers and pending requests it started | No |

**A script cannot be un-executed.** This is why an honest withdrawal flow ends in a page reload, and why
the demo says so on screen instead of pretending the state is clean. Anything that claims otherwise is
telling the user something false about their own data.

## The rules the pattern satisfies

- **No pre-ticked boxes.** Every vendor starts denied and the stored record starts empty.
- **Refusing is as easy as accepting.** Withdraw sits beside Consent: same page, same size, no second dialog.
- **Granular per purpose.** Analytics, support chat and session recording are three decisions.
- **Withdrawal at any time**, and as easy as the original grant.
- **Evidence.** A production record adds a timestamp and the version of the text the user was shown.
- **No dark patterns.** Refusal is not slower, smaller or uglier than acceptance.

## Beyond the browser

- **Store the record server-side** if you have to prove it in an audit. Browser storage is deletable by the
  person you would be proving it against.
- **Sign a processor agreement (Art. 28 DSGVO)** with every vendor in the list. Consent is the lawful basis
  for the processing; the agreement is what makes the vendor a lawful processor.
- **Check where the vendor is.** A transfer outside the EEA needs its own basis, and consent for cookies is
  not consent for a third-country transfer.
- **Add a Content Security Policy backstop.** If a vendor host is not in `script-src`, a bug in this code
  cannot leak anything. See the strict CSP demo.

## Where this sits in the module

`consent-privacy` covers the consent model itself: categories, lawful basis, the state machine. This demo
is the mechanical half: the tag, the request, the evidence, and what withdrawal genuinely cannot reverse.
