# Virtual Scroll Large Lists

Rendering 100 000 rows creates 100 000 DOM nodes, and the browser pays for every one of them on every
layout and paint. Virtual scrolling renders only the rows inside the viewport plus a small buffer, and
recycles them as the user scrolls.

## Use it

```typescript
import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from '@angular/cdk/scrolling';
```

```html
<cdk-virtual-scroll-viewport [itemSize]="56" (renderedRangeChange)="onRangeChange($event)">
  <div class="row" *cdkVirtualFor="let item of items; let odd = odd" [class.alternate]="odd">
    {{ item.label }}
  </div>
</cdk-virtual-scroll-viewport>
```

`*cdkVirtualFor` is a structural directive, not a control-flow block: `@for` has no virtualised form, so
this is one of the few places where the star syntax is still correct.

## The rules that make it work

- `itemSize` must match the real rendered row height in pixels. If it does not, the scrollbar length is
  wrong and the list jumps.
- The viewport needs an explicit height. Without one it collapses and nothing renders.
- Every row must be the same height for `CdkFixedSizeVirtualScroll`. For variable heights use
  `autosize` from `@angular/cdk-experimental/scrolling`, at a measurable cost.
- Keep the row template cheap. It is instantiated and destroyed constantly while scrolling.

## Observe what is actually rendered

```typescript
readonly range = signal({ start: 0, end: 0 });
readonly rendered = computed(() => this.range().end - this.range().start);
```

`renderedRangeChange` reports the slice currently in the DOM. The demo shows the count next to the total,
which is the clearest way to see what virtualisation buys: a few dozen nodes instead of a hundred
thousand.

## Programmatic scrolling

```typescript
readonly viewport = viewChild.required(CdkVirtualScrollViewport);

jumpToEnd() {
  this.viewport().scrollToIndex(this.items.length - 1, 'smooth');
}
```

`viewChild.required()` is the signal query. `@ViewChild` is the decorator form it replaced.

## When not to use it

If the list is short, virtualisation costs more than it saves. Below roughly 100 rows, render them all.
And if the user needs Ctrl+F to work across the whole list, virtual scrolling breaks that expectation:
paginate or provide a search field instead.
