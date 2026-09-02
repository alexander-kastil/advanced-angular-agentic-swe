# Gate Third-Party Content

## The rule

Under the GDPR and the ePrivacy rules, storing or reading anything on a user's device that is not
strictly necessary for the service requires consent that is **freely given, specific, informed and
unambiguous**. In practice that means:

- Nothing non-essential loads before the user agrees. Not the analytics script, not the video iframe,
  not the map tile that leaks the IP address.
- Rejecting must be as easy as accepting. One click to accept and three to reject is a design that
  regulators have repeatedly fined.
- Consent must be withdrawable at any time, as easily as it was given.
- Pre-ticked boxes are not consent. Scrolling is not consent.
- The record of what was consented to, and when, has to be kept.

Strictly necessary processing (the session, the consent record itself) does not need consent, but it
does still need to appear in the privacy notice.

## Model it as application state

The common failure is a third-party script tag in `index.html` that has already run by the time the
banner appears. Model consent as a signal and never render the embed until it is true.

```typescript
readonly granted = signal<Record<CategoryKey, boolean>>(this.restore());
readonly mediaAllowed = computed(() => this.granted().media);
```

```html
@if (mediaAllowed()) {
  <iframe [src]="playerUrl()" title="Product tour"></iframe>
} @else {
  <div class="blocked">
    <p>This content is provided by a third party that would receive your IP address.</p>
    <button type="button" (click)="toggle('media')">Load it once</button>
  </div>
}
```

The `@if` is the enforcement point. There is no way for the iframe to exist before the condition holds,
which is a much stronger guarantee than a script that promises not to fire.

## Persist the record, defensively

```typescript
effect(() => {
  const state = this.granted();
  if (this.decided()) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      return;
    }
  }
});
```

Every `localStorage` access is wrapped: private windows, cleared site data and browsers configured to
block storage all throw, and the app must still render.

## Withdrawal

`withdraw()` clears the record and resets every optional category. Expose it permanently, not only in
the banner: a link in the footer is the usual pattern, and its absence is a common finding.

## Checklist for a real implementation

- Categories, purposes and lawful basis documented in the privacy notice, matching the UI exactly.
- Accept, reject and granular save available at the same level of the dialog.
- Consent timestamp and policy version stored with the choice, so a policy change can re-ask.
- Server-side enforcement too. A client-side gate protects the user; it does not protect you from a
  backend that logs what it should not.
- Data processing agreements (Art. 28) in place with every third party you gate.
