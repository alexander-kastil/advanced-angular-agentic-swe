# Route Guards

## Stacking guards on one route

Guards in a `canActivate` array run in order and all of them must pass. Splitting the policy into one guard per rule keeps each guard trivial and lets you recombine them per route.

```typescript
{
  path: 'multi-guard',
  component: MultiGuardComponent,
  children: [
    { path: 'members', component: MembersComponent, canActivate: [onlyAuthenticatedGuard] },
    {
      path: 'prime',
      component: PrimeComponent,
      canActivate: [onlyAuthenticatedGuard, onlyPrimeMembersGuard],
    },
  ],
},
```

## Functional guards reading signals

A guard is a function. It runs in an injection context, so it can `inject()` anything, and when the state it reads is a signal the guard is a plain synchronous boolean.

```typescript
export const onlyPrimeMembersGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const sns = inject(SnackbarService);

  if (auth.isPrimeMember()) {
    return true;
  }

  sns.displayAlert('No Access', 'Access only for prime members');
  return false;
};
```

## The mock auth state

`AuthFacade` keeps the mock session in a single signal and exposes derived values as `computed()`. No store, no actions, no effects.

```typescript
@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly state = signal<AuthState>({ user: null, token: null, isPrimeMember: false });

  readonly user = computed(() => this.state().user);
  readonly isAuthenticated = computed(() => this.state().user !== null);
  readonly isPrimeMember = computed(() => this.state().isPrimeMember);
}
```

Toggle logged-in and prime membership with the buttons below, then try both child routes.
