# Angular Component (v21+)

Standalone by default - do NOT set `standalone: true`. Always `ChangeDetectionStrategy.OnPush`.

## Structure

```typescript
import { Component, ChangeDetectionStrategy, inject, input, output, computed, booleanAttribute } from '@angular/core';

@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'user-card',
    '[class.active]': 'isActive()',
    '(click)': 'handleClick()',
  },
  template: `
    @if (showEmail()) { <p>{{ email() }}</p> }
    @for (item of items(); track item.id) { <span>{{ item.name }}</span> }
    @switch (status()) {
      @case ('active') { <span>Active</span> }
      @default { <span>Inactive</span> }
    }
  `,
})
export class UserCard {
  name = input.required<string>();
  email = input<string>('');
  showEmail = input(false);
  isActive = input(false, { transform: booleanAttribute });
  items = input<Item[]>([]);
  selected = output<string>();
  avatarUrl = computed(() => `/avatars/${this.name()}`);

  handleClick() { this.selected.emit(this.name()); }
}
```

## Signal Inputs

```typescript
name = input.required<string>();          // Required
count = input(0);                         // Optional with default
label = input<string>();                  // Optional, undefined allowed
size = input('medium', { alias: 'buttonSize' });
disabled = input(false, { transform: booleanAttribute });
value = input(0, { transform: numberAttribute });
```

## Signal Outputs

```typescript
clicked = output<void>();
selected = output<Item>();
valueChange = output<number>({ alias: 'change' });
```

## Host Object (no @HostBinding/@HostListener)

```typescript
host: {
  'role': 'button',
  '[class.primary]': 'variant() === "primary"',
  '[attr.aria-disabled]': 'disabled()',
  '[attr.tabindex]': 'disabled() ? -1 : 0',
  '(click)': 'onClick($event)',
  '(keydown.enter)': 'onClick($event)',
}
```

## Content Projection

```typescript
template: `
  <header><ng-content select="[card-header]" /></header>
  <main><ng-content /></main>
  <footer><ng-content select="[card-footer]" /></footer>
`
```

## Lifecycle

```typescript
constructor() {
  afterNextRender(() => { /* DOM - runs once, SSR-safe */ });
  afterRender(() => { /* runs after every render */ });
}
ngOnInit() {}
ngOnDestroy() {}
```

## Class/Style Bindings (no ngClass/ngStyle)

```html
<div [class.active]="isActive()">...</div>
<div [style.color]="textColor()">...</div>
```

## Images

```typescript
imports: [NgOptimizedImage]
// template: <img ngSrc="/assets/hero.jpg" width="800" height="600" priority />
```

## Accessibility

- Pass AXE checks, meet WCAG AA
- ARIA attributes for interactive elements
- Keyboard navigation + visible focus indicators
