# Advanced Routing and App Initialization

[Animations Explorer](https://williamjuan027.github.io/angular-animations-explorer/)

## Demos

| #   | Route                      | Title                         | Teaches                                                                                                                                                                 | Topic                 |
| --- | -------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 1   | `app-init`                 | App Initialization            | Configure application startup behavior using APP_INITIALIZER tokens. Run setup logic before the application bootstraps.                                                 | App Initialization    |
| 2   | `inject`                   | DI: Inject & Provide          | Use the inject() function to retrieve registered dependencies in a component. Learn how to provide custom services and configure injection tokens.                      | App Initialization    |
| 3   | `global-errors`            | Global Error Handler          | Implement a global error handler using ErrorHandler token. Catch and log all application errors in one place.                                                           | Error Handling        |
| 4   | `http-errors`              | HTTP Error Handler            | Create interceptors that catch and transform HTTP errors. Implement centralized error recovery strategies.                                                              | Error Handling        |
| 5   | `multi-interceptor`        | HTTP Interceptors             | Create multiple HTTP interceptors to add cross-cutting concerns like auth headers, logging, and error handling. Chain interceptors for request/response transformation. | Error Handling        |
| 6   | `router-bindings`          | Component Input Bindings      | Bind route parameters directly to component inputs using bindToComponentInputs strategy. Simplify parameter handling with signal-based inputs.                          | Routing               |
| 7   | `ngrx-routing`             | NgRx Router State             | Access router state through NgRx store. Manage navigation history and route parameters in application state.                                                            | Routing               |
| 8   | `route-titles`             | Route Titles                  | Set dynamic page titles for each route using the title property in route configuration. Update browser tab titles automatically.                                        | Routing               |
| 9   | `router-animations`        | Router Animations             | Add smooth transitions between route components using Angular animations. Enhance navigation UX with view enter/exit effects.                                           | Routing               |
| 10  | `view-transitions`         | View Transitions              | Leverage native View Transitions API for seamless animated navigation. Create shared element animations across route changes.                                           | Routing               |
| 11  | `can-match-guard`          | CanMatch Guard                | Use canMatch guards to conditionally load routes based on runtime conditions. Prevent route initialization before matching.                                             | Routing               |
| 12  | `multi-guard`              | Route Guards                  | Stack multiple route guards to enforce authorization policies. Combine authentication and role-based access control.                                                    | Routing               |
| 13  | `preloading-strategy`      | Preloading Strategy           | Implement custom preloading strategies to eager-load routes in the background. Optimize performance with selective preloading.                                          | Routing               |
| 14  | `http-resource`            | HTTP Resource                 | Fetch data declaratively using the resource() function with signal-based reactive requests. Manage loading and error states automatically.                              | Routing               |
| 15  | `httpresource-resolver`    | HTTP Resource Route Resolver  | Preload route data using ResolveFn with HTTP requests. Deliver type-safe data to components via signal-based inputs without managing subscriptions.                     | Routing               |
| 16  | `route-resolvers-signals`  | Route Resolvers with Signals  | Preload route data using ResolveFn with signals. Bind resolved data directly to component signal inputs for type-safe, auto-unwrapped data delivery.                    | Routing               |
| 17  | `query-params-signals`     | Query Parameters with Signals | Manage query parameters reactively using signals. Synchronize component state with URL search params for bookmarkable, shareable filtered views.                        | Routing               |

## Demos Reference

Add Routing:

```
ng add @ngrx/router-store
```

```
npm install @ngrx/router-store --save
```

### Configuration

This effects changes in app.module.ts

Possible Settings:

```typescript
interface StoreRouterConfig {
  stateKey?: string | Selector<any, RouterReducerState<T>>;
  serializer?: new (...args: any[]) => RouterStateSerializer;
  navigationActionTiming?: NavigationActionTiming;
  routerState?: RouterState;
}
```

### Router State Serialization:

Setting to Full enables the DefaultRouterStateSerializer

```typescript
StoreRouterConnectingModule.forRoot({
  routerState: RouterState.Full,
});
```

Setting to Minimal enables the MinimalRouterStateSerialzer

```typescript
StoreRouterConnectingModule.forRoot({
  routerState: RouterState.Minimal,
});
```

REMARK:
Dependent on Runtime Checks only the minimal Router Serializer can be used! The Full Router State will not be serializeable and therefore does not work with the Serializeability runtime checks!
An own serializer can be implemented.

Example for runtime checks

```typescript
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
      },
      metaReducers
    })
```

### Navigate by Action - Effect

e.g there is a canLoad Guard:

```typescript
@Injectable({
  providedIn: 'root'
})
export class FBAuthGuard implements CanLoad {
  constructor(private store: Store<AuthState>) {}

  // this is a canLoad Guard - it does not prevent access after a logout
  canLoad(): boolean | Observable<boolean> | Promise<boolean> {
    return this.store.select(getUser).pipe(
      map(user => {
        if (user && user.email) {
        	return true
        } else {
          this.store.dispatch(new LoginRedirect());
          return false;
        }
      })
    );
  }
}
```

The LoginRedirect can be listened to in an effect:

```typescript
@Injectable()
export class AuthEffects {
  constructor(
  	private actions$: Actions,
  	private as: AuthService,
  	private router:Router) {}

  // Redirect to login page
  @Effect()
  loginRedirect$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoginRedirect),
    pluck('payload'),
    exhaustMap(() => {
      this.router.navigate(['demos','login'])
      return EMPTY
    })

  );
```

This mechanism can be used to transfer the control over the viewed page completely to the state, instead of the UI and the router.
