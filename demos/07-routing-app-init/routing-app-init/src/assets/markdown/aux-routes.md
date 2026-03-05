Angular supports the concept of auxiliary routes, which allow you to set up and navigate multiple independent routes in a single app. Auxiliary routes allow the user to access or toggle portions of the page, such as a side-bar or dialog, using the URL. In our case we will be using auxiliary routes to implement authentication. The SignIn and SignUp components will be displayed in the actions outlet when the user is authenticated. The following image shows the SignIn and SignUp components in the actions outlet:

Notice the `authEnabled-flag` in `environment.ts` and the named actions-outlet in app.component.ts. 

```html
<div gdArea="main">
    <router-outlet></router-outlet>
    <router-outlet name="actions"></router-outlet>
</div>
```

Examine `auth/auth.module.ts`,  the implementation of `auth.state.ts` and the routes in `auth-routing.module.ts`. Notice the following html in `intro.component.html`:

```html
<mat-card-actions>
<div *ngIf="isAuthenticated">
    <button mat-raised-button routerLink="/demos" color="primary">Proceed</button>
</div>
<div *ngIf="!isAuthenticated">
    <button mat-raised-button color="primary"
        [routerLink]="[{ outlets: { actions: ['auth', 'sign-in'] } }]"    
        >Sign In</button>
    <button mat-raised-button color="primary"
        [routerLink]="[{ outlets: { actions: ['auth', 'sign-up'] } }]"    
        >Sign Up</button>
</div>
</mat-card-actions>
```

Activate the `canLoad-guard` in `auth-routing.module.ts` and toggle `authEnabled` in `environment.ts` and try to understand the authentication process and it's use of the `actions-outlet`