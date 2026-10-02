# The Sign-In Round Trip

The guard sends a user away; this page brings them back. Three details separate a login that feels
native from one that feels bolted on: the shell shows only what a signed-in user can use, the user
lands where they were going, and an expired session says so.

## Render the shell from the store

```html
@if (auth.isAuthenticated()) {
  <app-navbar />
  <app-current-user [name]="auth.userName()" (logout)="auth.logout()" />
} @else {
  <app-login />
}
```

The original module wrapped the navbar in `*ngIf="isAuthenticated | async"`. With signals the
template reads `auth.isAuthenticated()` directly and updates the moment the token expires.

## Return to the attempted page

The guard stored the URL; the login page consumes it once:

```typescript
async login(): Promise<void> {
  this.auth.login(this.name(), 20);
  const returnUrl = this.auth.takeReturnUrl();
  if (returnUrl) {
    await this.router.navigateByUrl(returnUrl);
  }
}
```

`takeReturnUrl()` reads and clears in one method, so a second sign-in does not jump to a stale
page. With MSAL the same job is done by the `redirectStartPage` of the login request, and the URL
travels through the identity provider's `state` parameter.

## Tell "expired" from "never signed in"

```typescript
readonly sessionExpired = computed(
  () => this.auth.token() !== null && !this.auth.isAuthenticated()
);
```

The store keeps the expired token until `logout()`, which is what makes the distinction possible.

## Run the demo

1. Open **Guarding Routes with canMatch** while signed out and click the protected link. You arrive
   here with a banner naming `/demos/protected-area`.
2. Sign in. You are taken straight to the protected page.
3. Come back to **The Sign-In Round Trip** and wait 20 seconds.

Expected result: the navigation and user menu disappear at zero and the banner reads "Your session
expired".
