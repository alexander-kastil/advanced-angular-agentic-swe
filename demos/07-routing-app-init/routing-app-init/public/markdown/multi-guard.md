- Examine the use of `mock auth` in the `skills-route`.

- Examine routing config in `demo.routes.ts` and the use of guards in the children of the `multi-guard` route. OnlyPrimeMembersGuard is implemented in a functional pattern which should be the preferred approach. It is using `/mock-auth/state/auth.state.ts` to determine if the user is logged in and a prime member:

```typescript
{ path: 'multi-guard',
  component: MultiGuardComponent,
  children: [
      { path: 'members', component: MembersComponent,
        canActivate: [onlyAuthenticatedGuard],},
      { path: 'prime',component: PrimeComponent,
        canActivate: [onlyAuthenticatedGuard, onlyPrimeMembersGuard]
```

- Toggle values in `auth.state.ts` using the buttons below and access routes. Mock member state is kept in NgRx:

```typescript
export interface AuthState {
    user: any;
    token: string | null;
    authEnabled: boolean;
    isPrimeMember: boolean;
}
```