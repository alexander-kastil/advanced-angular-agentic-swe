Angular 17 introduced a new feature called view transitions. This feature allows you to animate the transition between views in your Angular application. 

- To enable view transitions, you need to provide the router with the `withViewTransitions` function and reference `::view-transition-old` and `::view-transition-new` in your styles.

    ```typescript
    provideRouter(
        ...
        withViewTransitions()
    ),
    ```