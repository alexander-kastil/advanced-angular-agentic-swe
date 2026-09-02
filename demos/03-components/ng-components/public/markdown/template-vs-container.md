# Template vs Container

Two ways to hand markup to a child component, and they behave differently.

- `ng-content` **projects**: the parent creates the nodes once, the child decides where they go.
- `ng-template` + `ngTemplateOutlet` **instantiates**: the child renders the template, as often as it likes, whenever it likes.

## The experiment

Both expanders receive the same `<app-clock />`. Expand and collapse each one several times and compare the time inside against the live clock at the top.

- `expander.component.html` uses `<ng-content />`. The clock was created when the parent rendered, so its timestamp is frozen at that moment and survives every collapse.
- `expander-template.component.html` uses `ngTemplateOutlet`. The clock is created each time the block is rendered, so the timestamp is current on every expand.

## ng-content

```html
<div class="expander">
  <div class="projection">
    <ng-content />
  </div>
</div>
```

## ng-template passed as an input

```html
<ng-template #clock>
  <app-clock />
</ng-template>
<app-expander-template title="expander using ng-template" [content]="clock" />
```

```typescript
export class ExpanderTemplateComponent {
  readonly content = input<TemplateRef<unknown> | null>(null);
  readonly expanded = signal(false);
}
```

```html
@if (expanded()) {
  <ng-container [ngTemplateOutlet]="content()" />
}
```

## ng-container

`ng-container` is a grouping element that leaves no node in the DOM. Use it to host a structural binding, or to wrap several elements inside a control flow block without adding a wrapper div.

## Which to choose

| Need | Use |
| --- | --- |
| One fixed slot of caller markup | `ng-content` |
| Render caller markup more than once, e.g. per row | `ng-template` + `ngTemplateOutlet` |
| Render it lazily or conditionally | `ng-template` + `ngTemplateOutlet` |
| Pass data back to the caller's markup | `ng-template` with a context object |
| Group elements without a DOM wrapper | `ng-container` |
