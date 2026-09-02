# Router Animations

Angular 22 has no animation package for this. `@angular/animations`, `trigger`, `transition` and `state` are gone from this demo; entering and leaving elements are animated with plain CSS, and route changes are animated by the browser.

## animate.enter and animate.leave

Name a CSS class on the element. Angular adds it while the element enters, and on the way out it keeps the element in the DOM until the animation finishes.

```html
@for (panel of panels(); track panel.id) {
  <div class="panel" animate.enter="slide-in" animate.leave="slide-out">
    {{ panel.label }}
  </div>
}
```

```scss
.slide-in {
  animation: slide-in 300ms ease-out;
}

.slide-out {
  animation: slide-out 300ms ease-in;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-24px);
  }
}

@keyframes slide-out {
  to {
    opacity: 0;
    transform: translateX(24px);
  }
}
```

Both bindings also accept an expression, so the class can be chosen at runtime: `[animate.enter]="isUrgent() ? 'flash' : 'slide-in'"`.

## Animating the route swap

Navigation itself is handed to the native View Transitions API:

```typescript
provideRouter(
  appRoutes,
  withViewTransitions()
),
```

The keyframes live in `src/theme/view-transition.scss` and target `::view-transition-old(root)` and `::view-transition-new(root)`. Nothing is declared on the component.

## Migrating from the old API

| Angular 17 style | Angular 22 |
|---|---|
| `animations: [trigger(...)]` in `@Component` | `animate.enter` / `animate.leave` in the template |
| `[@routeAnimation]` on the router outlet host | `withViewTransitions()` |
| `provideAnimations()` | not needed |
| `@angular/animations` dependency | removed from `package.json` |
