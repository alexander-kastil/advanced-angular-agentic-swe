# Migrate an existing app to Standalone Components

In this walkthrough we will migrate an existing application to standalone components. This migration process will consist of the following steps:

- Migrate and Application to Standalone Components
- Implement `app.config.ts` and `app.routes.ts`
- Cleanup and migrate remaining (lazy loaded) modules

## Migrate and Application to Standalone Components

- Use [migration-starter](/migration-starter/) project to migrate an existing Angular app to standalone. [migration-solution](/migration-solution/) is the result of this walkthrough.

- Execute the migration schematic 

    ```bash
    ng g @angular/core:standalone
    ```

    >Note: Make sure you have a clean Git repo before executing this step. Seeing the changed files will help you understand the changes that the schematic is making.

- Convert the existing app to a standalone component from the base path:

    ![migrate-convert](_images/migrate-convert.png)

    >Note: If you want you can run ng s -o between to see if any issues arise.

- Open demo-container.ts and review the @Component decorator:

    ```typescript
    @Component({
        selector: 'app-demo-container',
        templateUrl: './demo-container.component.html',
        styleUrls: ['./demo-container.component.scss'],
        standalone: true,
        imports: [
            MatSidenavContainer,
            MatSidenav,
            MatToolbar,
            MatToolbarRow,
            MatNavList,
            MatListItem,
            RouterLink,
            MatSidenavContent,
            NgStyle,
            RouterOutlet,
            MarkdownEditorComponent,
            SidePanelComponent,
            AsyncPipe,
        ],
    })
    ```    

- Notice that the imports array contains all the directives, components and modules that are used in the template. This is because the standalone component does not have access to the NgModule that was previously used to declare the directives.    

- Also notice that the imports on top of the file is very fine grained where ever possible. 

    ```typescript
    import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
    import { NgStyle, AsyncPipe } from '@angular/common';
    ```
    >Note: If you want you can look at other components that have changed.

- Run the migration schematic again and this time select the option to `Bootstrap the application using standalone APIs`. After completion you should see the following changes in `main.ts`. This is a good starting point but we will 
   
    ```typescript
    bootstrapApplication(AppComponent, {
        providers: [
            provideHttpClient(),
            LoadingService,
            { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
            provideAnimations(),
        ]
    })
    .catch(err => console.error(err));
    ```

    >Note: If you want you can still use the Visual Studio Code - F1 - Organize Imports to clean up the imports.

    ![organize-imports](_images/organize-imports.png)

- After running the schematic and execution the application you should be able to compile the application but the application will not display correct and you will see the following error in the console:

    ![provider-error](_images/provider-error.png)

- Just to get the app running use `importProvidersFrom(AppRoutingModule)`. This is not our final solution but it will get the app running. `importProvidersFrom(...)` is a pretty powerful function that will import all the providers from the specified module. It is usually not the preferred way to import providers but it is a good starting point that will bring you one step further in the migration process. There are many `provideThisAndThat()` functions that you can use to import providers for Angular base functionality as well as third party libraries such as `Angular Material`, `NgRx` or others.
    
    ```typescript
    bootstrapApplication(AppComponent, {
        providers: [
            importProvidersFrom(AppRoutingModule),
            provideHttpClient(),
            LoadingService,
            { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
            provideAnimations(),
        ]
    })
    .catch(err => console.error(err));
    ```

## Implement app.config.ts and app.routes.ts    

- In the src/app folder create a new file named `app.routes.ts` and add the following code:

    ```typescript
    export const routes: Routes = [
        {
            path: '',
            component: HomeComponent,
        },
        {
            path: 'demos',
            loadChildren: () =>
                import('./demos/demos.module').then((m) => m.DemosModule),
        }
    ];
    ```

- In the `src/app` folder create a new file named `app.config.ts` and add the following code to create the base structure of the ApplicationConfig. Depending on your application we will have to add additional providers:

    ```typescript
    import { ApplicationConfig } from '@angular/core';

    export const appConfig: ApplicationConfig = {
        providers: [
            provideHttpClient(),
            provideRouter(routes),
            provideAnimations(),
        ],
    };
    ```

- Open `main.ts`, save the current configuration and replace it with the following code:

    ```typescript
    bootstrapApplication(AppComponent, appConfig)
        .catch(err => console.error(err));
    ```

- Run the application to see if it is still working. 

## Cleanup and migrate remaining (lazy loaded) modules

- There are some models left in this app:

    - shared.module.ts
    - demos.module.ts

- As all components in the shared folder have been migrated to standalone components we can remove the `shared.module.ts` file. Remove its import from `demo.module.ts`. Check if the application is still working.

- That is all for now. We will remove the `demos.module.ts` file in the mode later on.