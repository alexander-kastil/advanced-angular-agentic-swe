# Content projection, view queries and content queries

## Content Projection

```typescript
@Component({
  selector: 'app-card',
  template: `
    <header>
      <ng-content select="[card-header]" />
    </header>
    <main>
      <ng-content />
    </main>
    <footer>
      <ng-content select="[card-footer]" />
    </footer>
  `,
})
export class Card {}

// Usage:
// <app-card>
//   <h2 card-header>Title</h2>
//   <p>Main content</p>
//   <button card-footer>Action</button>
// </app-card>
```

## View Queries

Query elements and components in the template:

```typescript
import { Component, viewChild, viewChildren, ElementRef } from '@angular/core';

@Component({
  selector: 'app-gallery',
  template: `
    <div #container class="gallery">
      @for (image of images(); track image.id) {
        <app-image-card [image]="image" />
      }
    </div>
  `,
})
export class Gallery {
  images = input.required<Image[]>();

  // Query single element
  container = viewChild.required<ElementRef<HTMLDivElement>>('container');

  // Query single component (optional)
  firstCard = viewChild(ImageCard);

  // Query all matching components
  allCards = viewChildren(ImageCard);
}
```

## Content Queries

Query projected content:

```typescript
import { Component, contentChild, contentChildren, effect, signal } from '@angular/core';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tab-headers">
      @for (tab of tabs(); track tab.label()) {
        <button
          [class.active]="tab === activeTab()"
          (click)="selectTab(tab)"
        >
          {{ tab.label() }}
        </button>
      }
    </div>
    <div class="tab-content">
      <ng-content />
    </div>
  `,
})
export class Tabs {
  // Query all projected Tab children
  tabs = contentChildren(Tab);

  // Query single projected element
  header = contentChild('tabHeader');

  activeTab = signal<Tab | undefined>(undefined);

  constructor() {
    // Set first tab as active when tabs are available
    effect(() => {
      const firstTab = this.tabs()[0];
      if (firstTab && !this.activeTab()) {
        this.activeTab.set(firstTab);
      }
    });
  }

  selectTab(tab: Tab) {
    this.activeTab.set(tab);
  }
}

@Component({
  selector: 'app-tab',
  template: `<ng-content />`,
  host: {
    '[class.active]': 'isActive()',
    '[style.display]': 'isActive() ? "block" : "none"',
  },
})
export class Tab {
  label = input.required<string>();
  isActive = input(false);
}
```

## Where queries and DI stop (shared wrappers around templated content)

A wrapper (accordion, section, panel) that must react to the card it wraps meets three boundaries.
Each fails silently: no error, the wrapper just never sees the child.

1. **Queries never pierce a component or an outlet.** `contentChildren(Card, { descendants: true })`
   finds only cards written inline between the wrapper's tags in the same template. A card inside a
   child component's template, or inside an `ngTemplateOutlet` of an `<ng-template>` declared
   elsewhere, is invisible. Do not count rendered children to choose a mode; let the template author
   declare it (`<app-group single>`).
2. **`ngTemplateOutlet` content injects from where the template was declared**, not where it is
   rendered. To let content find the wrapper with `inject(Wrapper, { optional: true })`, render it
   with `ngTemplateOutletInjector="outlet"`:

   ```html
   <app-group single ...>
     <ng-container [ngTemplateOutlet]="tplForm" ngTemplateOutletInjector="outlet" />
   </app-group>
   ```

   Only the outermost matching child should react: provide a token on the child and read it with
   `inject(TOKEN, { optional: true, skipSelf: true })` to detect a nested instance.
3. **Two default `<ng-content />` in `@if`/`@else` branches**: content goes to the last one, so the
   other branch renders empty. Wrap it once, `<ng-template #content><ng-content /></ng-template>`, and
   render `<ng-container [ngTemplateOutlet]="content" />` in each branch.

Prove it in the browser, not in a spec: count the wrapper's rendered mode per instance on the real
page (a spec usually writes the child inline, the one case where queries do work).

Back to the index: [angular-component](angular-component.md)
