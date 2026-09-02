# animate.enter and animate.leave on Route Transitions

## No animations package

`@angular/animations` is not installed in this app, and router animations no longer need it. Two template attributes cover entering and leaving:

```html
<div class="stage overview" animate.enter="stage-enter" animate.leave="stage-leave">
  ...
</div>
```

`animate.enter` names the class Angular adds when the element is inserted. `animate.leave` names the class it adds before removal, and Angular keeps the element in the DOM until that animation ends. The classes are ordinary CSS:

```scss
.stage-enter {
  animation: stage-enter 320ms ease-out;
}

.stage-leave {
  animation: stage-leave 320ms ease-in;
}
```

CSS transitions work as well as keyframe animations; Angular waits for whichever finishes last.

## Why this demo uses two components

The router only destroys the outlet's component when the *component* changes. Two child routes pointing at the same component with different parameters reuse the instance, nothing is removed, and `animate.leave` never fires.

```typescript
{
  path: 'animate-enter-leave',
  component: AnimateEnterLeaveComponent,
  children: [
    { path: '', pathMatch: 'full', redirectTo: 'overview' },
    { path: 'overview', component: OverviewStageComponent },
    { path: 'details', component: DetailsStageComponent },
  ],
},
```

Two distinct components force a real destroy-and-create, which is what the animation hooks respond to. When a single component must animate on a parameter change, drive it from a `@if` over a signal instead, the way the Router Animations demo does with its list.

## Together with view transitions

`withViewTransitions()` is registered app-wide in `app.config.ts`:

```typescript
provideRouter(appRoutes, withComponentInputBinding(), withViewTransitions()),
```

The two mechanisms do different jobs and compose:

- The View Transitions API snapshots the old page, swaps the DOM, and cross-fades the whole document. It is the browser's work, styled through `::view-transition-old(root)` and `::view-transition-new(root)`.
- `animate.enter` and `animate.leave` animate one specific element in the new and old trees. It is Angular's work, styled with an ordinary class.

Use view transitions for the page-level swap and the enter/leave attributes for the elements you want to move on their own path. Keep the durations close, or the element animation finishes into a page that is still fading.

Browsers without the View Transitions API fall back to an instant swap and the enter/leave animations still run, so this demo degrades cleanly.
