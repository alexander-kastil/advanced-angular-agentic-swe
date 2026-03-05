# Server Side Rendering (SSR)

-   Create a new Angular project. Starting with Angular 17 SSR is enabled by default. To disable it use `--ssr=false`. So you could basically skip the `--ssr=true` option. To add it to an existing project use `ng add @angular/ssr`:

    ```
    ng new food-shop-ssr --routing --style=scss --ssr=true
    cd food-shop-ssr
    ```

-   Examine `package.json` and note the `@angular/ssr`and `express` dependencies. Also note the `serve:ssr:food-shop-ssr` script. It starts the Node Express server and runs the Angular app in SSR mode.

- Examine the registration of [ClientHydration](https://angular.io/guide/hydration) in `app.config.ts`:

    ```typescript
    export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(),
        provideRouter(foodRoutes),
        provideClientHydration(),
        provideAnimations()
    ]
    };
    ```

-   Add Angular Material:

    ```
    ng add @angular/material
    ```

-   Add the following html to app.component.html and also add the required imports:

    ```html
    <mat-toolbar>
        <mat-toolbar-row>
            Food SSR Shop
        </mat-toolbar-row>
    </mat-toolbar>
    <router-outlet></router-outlet>
    ```

-   Add a script to track First Contentful Paint (FCP) to the `<head>` of `index.html`:

    ```javascript
    <script>
        // Log first contentful paint
        // https://web.dev/fcp/#measure-fcp-in-javascript
        const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntriesByName("first-contentful-paint")) {
            console.log("FCP: ", entry.startTime);
            observer.disconnect();
        }
        });
        observer.observe({ type: "paint", buffered: true });
    </script>
    ```

    > Note: Reade more about [PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) on MDN and on [web.dev](https://web.dev/articles/user-centric-performance-metrics).

-   Execute Client and note the `First Contentful Paint (FCP)` value in the console:

    ```bash
    ng s -o
    ```

- Examine the page source and note that the content is rendered by the browser using javascript:

    ![page-source](_images/page-source.png)
    
-   Execute Node Express on `http://localhost:4000` and compare `First Contentful Paint (FCP)` values and examine the html source. Also create Lighthouse Audit and compare time used for `Scripting`

    ```bash
    ng build
    npm run serve:ssr:food-shop-ssr
    ```

    >Note: If you get a warning that the maximum bundle size is exceeded, you can increase it by setting ` "maximumWarning": "550kb",` in `angular.json`.

## Use Pre-rendering

- To save some time you will provided with the [artifacts](./food-shop-ssr-artifacts/) of this app:

    -   Add `food/food-model.ts` from artifacts folder
    -   Add `food/food.service.ts` from artifacts folder
    -   Add `food/shop-item.component.ts` from artifacts folder
    -   Add `food/food-list.component.ts` from artifacts folder
    -   Add `food/food-details.component.ts` from artifacts folder
    -   Add `shared/number-picker.component.ts` from artifacts folder. The number picker is custom component that allows to be used as a form control because it implements `ControlValueAccessor` interface. To read more about it check [this article](https://blog.angular-university.io/angular-custom-form-controls/).
    -   Add `shared/euro.pipe.ts` from artifacts folder

    > Note: After adding each file review the code and make sure you understand it.

-   Run this simple mock shopping site to get familiar to it

-   Add routes to `app.routes.ts`:

    ```typescript
    export const foodRoutes: Routes = [
        {
            path: '',
            component: FoodListComponent,
        },
        {
            path: 'food/:id',
            component: FoodDetailsComponent,
        }
    ];
    ```

-   Create `routes.txt` in the root folder. It defines routes to pre-render:

```
/food/1
/food/2
/food/3
```

-   To configure pre-rendered pages open `angular.json` and replace the following to the `architect` section:

    ```json
    "prerender": true,
    ```

    with:

    ```json
    "prerender": {
        "routesFile": "routes.txt"
    },
    ```

-   Execute pre-rendering:

    ```bash
    ng build -c production
    ```

-   Examine `dist\food-list-ssr\browser\food\...`
