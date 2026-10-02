# Fix part 1: pin the layout with table-fixed

## Fix, part 1: pin the layout

```html
<table class="w-full table-fixed text-sm">
```

`table-fixed` (CSS `table-layout: fixed`) makes column widths come from the
`<th>` widths and the table width only, never from cell content. Widths are then
computed once from the header row instead of being re-derived per page.

Consequences to handle, not optional:

- Overflow no longer auto-expands a column, so any cell whose content can exceed
  its width needs `truncate` (or an explicit wrap rule). Long emails and free-text
  date fields are the usual offenders. Prefer truncation with the full value still
  reachable through an existing expand-row control over a `title` tooltip.
- Responsive columns (`hidden lg:table-cell`, `hidden xl:table-cell`) keep working:
  a `display: none` column does not participate in the fixed layout at all.

## The mirror image: with `table-layout: auto`, a `<colgroup>` is advisory and often inert

Percentages in a `<colgroup>` read like a specification and are not one. Under the default
`table-layout: auto` the browser sizes every column from its own content's minimum width, and once the
sum of those minima exceeds the container it ignores the declared percentages completely. Add
`whitespace-nowrap` to the cells, which is normal for money columns, and the minimum becomes the full
unwrapped string, so the percentages stop mattering at exactly the widths where you reached for them.

This is why "just adjust the column widths so the value fits" can be an unsatisfiable instruction. The
percentages are not what is deciding.

**Prove it in one step before you tune anything.** Temporarily set every `<col>` to `width: 0.1%` and
re-read the columns' `getBoundingClientRect().width`. If the numbers are unchanged, the colgroup is
inert and no redistribution of percentages will do anything. Measured case: a 13-column money table
produced byte-identical widths at 0.1% and at the tuned percentages.

When the colgroup is inert, the levers are the ones that change **content minimum width**, in this
order:

1. **Cell padding.** It is part of every column's minimum and is multiplied by the column count, so it
   is the largest single lever: dropping horizontal padding from `0.5rem` to `0.25rem` across 13
   columns recovered roughly 100px. Watch for an unlayered global `td { padding }` rule overriding the
   template's own `p-1` utility, which is the usual reason the padding is bigger than the markup says
   (see [angular-css-not-applying-unlayered-global](angular-css-not-applying-unlayered-global.md)).
   Scope the override to the component's own `:host table td, :host table th`, never to the global rule
   that every other table depends on.
2. Font size, which changes the string's width directly.
3. More container width.

Switching to `table-fixed` is **not** the fix here. It makes the percentages authoritative again, but
it does so by clipping content that does not fit rather than by making it fit, so a value that was
overflowing its column silently becomes a truncated one.

**Verify with the worst case, not the current data.** Inject the target string into every numeric
column at once, then assert `scrollWidth === clientWidth` per cell, on the table wrapper, and on
`document.documentElement`. Today's data having one large column proves nothing about the month when
several do.

Back to the index: [angular-table-column-layout](angular-table-column-layout.md)
