# Dynamic Components and Creation-Time Bindings

`ViewContainerRef.createComponent()` instantiates a component at runtime and attaches it to a
container in the template. No factory resolver, no entry components, no NgModule.

## The anchor

An `ng-container` with a template reference variable is the insertion point. Read it as a
`ViewContainerRef`.

```html
<div class="host">
  <ng-container #host />
</div>
```

```typescript
private readonly host = viewChild.required('host', { read: ViewContainerRef });
```

## setInput(): the one-shot form

```typescript
addInfo() {
  const ref = this.host().createComponent(InfoCardComponent);
  ref.setInput('message', `created at ${new Date().toLocaleTimeString()}`);
}
```

`setInput()` writes a value once and marks the component for check. It does not subscribe to
anything: if the source signal changes later, the created component keeps the old value until you
call `setInput()` again. That bookkeeping is what the binding API removes.

## bindings: the reactive form

`createComponent()` takes a `bindings` array, and `@angular/core` exports three functions to build
its entries:

| Function                                  | Direction     | Second argument                          |
| ----------------------------------------- | ------------- | ---------------------------------------- |
| `inputBinding(name, valueFn)`             | parent to child | a signal, or any getter function        |
| `outputBinding<T>(name, listener)`        | child to parent | a callback                              |
| `twoWayBinding(name, writableSignal)`     | both          | a writable signal, bound to a `model()`   |

```typescript
this.boundHost().createComponent(CounterCardComponent, {
  bindings: [
    inputBinding('label', this.headline),
    twoWayBinding('count', this.clicks),
    outputBinding<number>('reset', (value) => {
      this.clicks.set(0);
      this.lastReset.set(`reset from ${value}`);
    }),
  ],
});
```

These behave exactly like the template bindings they mirror. Writing `headline` in the parent
updates every created instance, and `+1` inside any instance writes back into `clicks` through the
two-way binding. `outputBinding` is generic over the emitted type, so the listener is typed.

The same options object also accepts `directives`, which applies directives to the created
component, with their own bindings via `DirectiveWithBindings`.

## The standalone createComponent()

`ViewContainerRef` needs a place in an existing view. When there is none, for example a popup
attached to `document.body`, use the `createComponent()` function from `@angular/core`:

```typescript
this.detached = createComponent(CounterCardComponent, {
  environmentInjector: this.environmentInjector,
  hostElement: this.detachedHost().nativeElement,
  bindings: [inputBinding('label', () => 'created outside the view')],
});
this.appRef.attachView(this.detached.hostView);
```

Two things differ from the `ViewContainerRef` form: the environment injector is required, and the
resulting view takes part in change detection only after `ApplicationRef.attachView()`. Call
`destroy()` on the `ComponentRef` when you are done, since no container owns it.

## Removing

```typescript
removeLast() {
  const container = this.host();
  if (container.length) {
    container.remove(container.length - 1);
  }
}

clear() {
  this.host().clear();
}
```

The container destroys the views it removes, so there is nothing else to clean up. A component
created with the standalone function is not in a container, so it needs `ref.destroy()`.

## When not to use any of this

Most cases that look dynamic are better served by `@if`, `@switch`, `@defer` or `ngTemplateOutlet`.
Reach for `createComponent()` when the set of components is genuinely open, for example a plugin
registry or a renderer driven by server data.
