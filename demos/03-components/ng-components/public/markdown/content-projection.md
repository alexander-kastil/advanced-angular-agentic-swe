# Content Projection

`ng-content` marks the slot where a parent's markup is rendered inside a child component. The projected nodes are created by the parent, so they keep the parent's injector, bindings and lifecycle: the child only decides *where* they land.

## Named slots

`ux-split` in this demo declares three slots and picks them with a CSS selector.

```html
<div class="container">
  <div class="split-title"><ng-content select=".title" /></div>
  <div class="split-main"><ng-content select=".main" /></div>
  <div class="split-sidebar"><ng-content select=".sidebar" /></div>
</div>
```

The caller fills them by writing plain markup:

```html
<ux-split>
  <div class="title">The Title</div>
  <div class="main">...</div>
  <div class="sidebar">
    <ux-button [label]="'Go Back'" [icon]="'keyboard_arrow_right'" />
  </div>
</ux-split>
```

`select` accepts any CSS selector: an element name (`select="header"`), an attribute (`select="[actions]"`) or a class as above.

## Default slot

A bare `<ng-content />` catches everything no named slot claimed. Without one, unmatched content is dropped silently.

## Fallback content

Content written between the tags of an `ng-content` element renders when the parent projects nothing into that slot.

```html
<ng-content select=".title">Untitled</ng-content>
```

## Rules worth knowing

- A given `ng-content` slot renders once. To repeat projected markup, take an `ng-template` input and use `ngTemplateOutlet` instead (see the Template vs Container demo).
- Projected content is created even when the slot sits inside an `@if` that is false, because the parent owns it. `@defer` is the exception.
- Query projected nodes with `contentChild` / `contentChildren` (see the Signal Queries demo), not with `viewChild`.
