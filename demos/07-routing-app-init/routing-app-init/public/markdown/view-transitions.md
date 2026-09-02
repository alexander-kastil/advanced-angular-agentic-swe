# View Transitions on Navigation

## What the router does

`withViewTransitions()` wraps every successful navigation in the browser's `document.startViewTransition()`. The browser snapshots the old DOM, the router swaps in the new component tree, and the browser cross-fades between the two snapshots. No animation library is involved and nothing in the component subscribes to anything.

```typescript
provideRouter(
  appRoutes,
  withComponentInputBinding(),
  withViewTransitions(),
  withPreloading(SelectivePreloadingStrategy)
),
```

The visible result is styled entirely in CSS through the pseudo elements the browser creates for the duration of the transition. This app keeps them in `src/theme/view-transition.scss`:

```scss
::view-transition-old(root) {
  animation: 290ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(root) {
  animation: 410ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
    300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}
```

## Options

`withViewTransitions()` takes an optional configuration object:

```typescript
withViewTransitions({
  skipInitialTransition: true,
  onViewTransitionCreated: ({ transition, from, to }) => {
    if (to.routeConfig?.path === 'error') {
      transition.skipTransition();
    }
  },
})
```

- `skipInitialTransition` suppresses the very first `startViewTransition` call, so the app does not fade in over an empty page during bootstrap.
- `onViewTransitionCreated` runs in an injection context, so it can `inject()` a service. It receives the live `ViewTransition` object plus the `from` and `to` route snapshots, which is where you call `transition.skipTransition()` to opt a single navigation out, or await `transition.finished` before doing follow-up work.

## Shared elements

A page-level cross-fade is the default. To make one element travel between the two views, give it a `view-transition-name` in CSS. The browser then animates that element separately from the root snapshot:

```scss
.hero {
  view-transition-name: demo-hero;
}
```

The name has to be unique per document at any moment. Two elements carrying the same name in the same snapshot cancels the transition, so a name that appears in a list is set per item, or cleared before the next navigation starts.

## Composing with animate.enter and animate.leave

Both mechanisms run at the same time and do different jobs:

- View transitions are the browser's work. They cover the whole document, are styled through `::view-transition-old` and `::view-transition-new`, and cannot be targeted at one component from Angular.
- `animate.enter` and `animate.leave` are Angular's work. They add a class to one specific element as it is inserted or before it is removed, and Angular keeps a leaving element in the DOM until its animation ends.

Use the view transition for the page-level swap, and the enter/leave attributes for the elements that should follow their own path. Keep the durations close, otherwise an element animation finishes into a page that is still fading. The Animate Enter and Leave demo shows the pair working together on child routes.

## When to choose which

- Route changes where the whole page is replaced: view transitions, with no per-component work at all.
- One element that must appear to persist across a route change: view transitions plus `view-transition-name`.
- Items entering or leaving a list inside one component, where no navigation happens: `animate.enter` and `animate.leave`. A view transition never fires here because the router is not involved.
- Anything that must run identically in every browser: the enter/leave attributes. Browsers without the View Transitions API fall back to an instant swap, and the router navigates normally.

## What this demo shows

The component reads `'startViewTransition' in document` into a signal and prints whether the running browser supports the API. The card carries the `.hero` block that owns `view-transition-name: demo-hero`, and the two buttons navigate to sibling demo routes so the configured root keyframes run on a real navigation. Watch the outgoing page slide left and fade while the incoming one slides in from the right.
