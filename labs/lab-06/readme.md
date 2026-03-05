# Food App - Routing & App Init

- Refactor Food App to use  Lazy Loading & Preloading
- Implement NgRx based Routing

## Lazy Loading & Preloading

- Examine the current routing setup and notice that food-container is already lazy loaded. 

```typescript
export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "food", loadComponent: () => import('./food/food-container/food-container.component').then(m => m.FoodContainerComponent) },
    { path: "about", component: AboutComponent }
];
```

Quickly read through [withPreloading](https://angular.io/api/router/withPreloading) in the Angular Docs. Also look through the related topics. We will use a flags based approach to enable preloading.

Create a file preloading-strategy.ts in the app folder:

```typescript
@Injectable({ providedIn: "root" })
export class FlagBasedPreloadingStrategy extends PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data?.["preload"] === true ? load() : of(null);
  }
}
```

This strategy will only preload routes that have a data property of preload set to true. We will use this on the food route in app.routes.ts:

```typescript
export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "food", data: { preload: true }, loadComponent: () => import('./food/food-container/food-container.component').then(m => m.FoodContainerComponent) },
    { path: "about", component: AboutComponent }
];
```

Update app.config.ts to use preloading:

```typescript
export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withPreloading(FlagBasedPreloadingStrategy)),
        ...
    ]
}
```    

Go to the network tab of the browser and reload the app. You should see the food module loaded in the background.

## NgRx based Routing

In this task we will implement a routing solution based on NgRx. This will allow us to control the routing from the state. For that purpose we will use the @ngrx/router-store package:

```
ng add @ngrx/router-store
```

>Note: If you had a clean repository you can see the changes of the ng add command. Basically it added the following provider to appConfig.ts:

```typescript
provideRouterStore()
```

Next we will add an `error-` and a `login-route` to the `app.routes.ts`. I assume that you can create the respective standalone components yourself. The routes should look like this:

```typescript
export const routes: Routes = [
    ...
    { path: "error", component: ErrorComponent },
    { path: "login", component: LoginComponent },
    { path: "**", redirectTo: "error" }
];
```

Use the following code and the demo app as sample to navigate to login and error:

```typescript
redirectToError$ = createEffect(() =>
  this.actions$.pipe(
    ofType(DemoActions.redirectToError),
    exhaustMap(() => {
      this.router.navigate(['/error']);
      return EMPTY.pipe(
        map(() => ({ type: 'Redirected to Error' }))
      );
    })
  )
);
```