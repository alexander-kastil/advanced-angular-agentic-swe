Lazy Loaded modules and their routes can be created using the Code Splitting Pattern:

```bash
ng g module [NAME] --route [ROUTE] --module [PARENT-MODULE]
```

You can try this on a clean GIT project so that you can see the changes made to the project and also be able to revert back to the original state:

```bash
ng g module products --route products --module app.module.ts
```

This will create a new module called products, with a route called products, and add the route to the app.module.ts file.

```typescript
const routes: Routes = [
  {
    path: '',
    component: AppshellComponent,
    children: [
      {
        path: 'skills',
        loadChildren: () =>
          import('../products/products.module').then((m) => m.ProductsModule),
      },
      ...
    ],
  },
];
```