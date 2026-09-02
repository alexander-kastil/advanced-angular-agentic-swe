# Route Titles

## Overview

Angular allows you to declaratively set page titles in route configuration using the `title` property.

## Benefits

- **SEO**: Search engines index page titles
- **User Experience**: Browser tabs show meaningful titles
- **Accessibility**: Screen readers announce page titles
- **Reduced Boilerplate**: No need to manually set titles in components

## Configuration

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home'
  },
  {
    path: 'demos',
    title: 'Demos',
    loadChildren: () => import('./demos/demo.routes')
  }
];
```

## Reading the Current Title

Use `Title` service to read the current page title:

```typescript
import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-example',
  template: `<p>Current title: {{ currentTitle() }}</p>`
})
export class ExampleComponent {
  private router = inject(Router);
  private titleService = inject(Title);

  protected currentTitle = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.titleService.getTitle())
    )
  );
}
```

## Dynamic Titles

Use `TitleStrategy` for computed titles:

```typescript
import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CustomTitleStrategy extends TitleStrategy {
  private title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    if (title) {
      this.title.setTitle(`MyApp | ${title}`);
    }
  }
}

// In app.config.ts
providers: [
  { provide: TitleStrategy, useClass: CustomTitleStrategy }
]
```

## Best Practices

- Set titles for all routes
- Use consistent naming patterns
- Keep titles concise (50-60 characters)
- Include app name or brand in title strategy
