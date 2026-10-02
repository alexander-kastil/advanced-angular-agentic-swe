# Splitting a large component into children

Extracting a page into child components is a mechanical refactor with four traps that no compiler and
no type-check will catch. Every one of them was hit in a single session that split four components in
one Angular 22 app; three parallel agents all reported "clean" and the build still failed.

Writing the child itself: [`angular-component-anatomy`](angular-component-anatomy.md). Inputs and
outputs: [`angular-component-inputs-outputs`](angular-component-inputs-outputs.md).

## The CSS does not follow the markup

Emulated view encapsulation scopes every rule to the template that declares it. Move markup into a
child and the parent's rules stop reaching it: the element keeps its classes, the rule text is still
in the CSSOM, and nothing matches. The page renders with UA defaults, which reads as unfinished
rather than broken. Diagnosis: [`angular-css-not-applying-component-scope`](angular-css-not-applying-component-scope.md).

So a brief that says "leave the shared rules in the parent stylesheet" is wrong, however tidy it
sounds. Three consequences, all of them normal:

- **A rule used by both parent and children is duplicated into each stylesheet that renders it.** The
  same `.panel`, `.table`, `.mono`, `.sr-only` block lives in four files. This is correct, not debt.
- **A `prefers-reduced-motion` (or any at-rule) block splits with its selectors**, each component
  keeping only the ones it renders.
- **Sibling and descendant selectors that spanned the old flat DOM break**, because the two halves
  now carry different `_ngcontent` attributes. `.group + .group .head { border-top: … }` matches
  nothing once each `.group` is its own component. Replace it with state the child already has: a
  `first` input driving a host class beats reaching across component boundaries.

The exception is markup the parent still authors and projects into the child. That element keeps the
*parent's* attribute, so a parent rule targeting it needs `::ng-deep` to cross the child's host
boundary, or the rule moves to the child and the element moves with it.

## A template reference variable shadows a class member of the same name

Inside the template scope that declares `#dialogEl`, the bare identifier `dialogEl` resolves to the
template reference variable, not to `this.dialogEl`. A `viewChild` signal named after the element it
queries therefore fails the moment you call it in that scope:

```html
<!-- #dialogEl is in scope here, so this calls the HTMLDivElement -->
<div #dialogEl>
  <app-resize-handle [dialogElement]="dialogEl()" />
</div>
```

```
TS2349: This expression is not callable. Type 'HTMLDivElement' has no call signatures.
```

The error names a DOM type where you expected an `ElementRef`, which sends people hunting for a
`read:` option or adding a cast. Neither is the fix. Rename the field (`dialogElRef`), keep the
locator string as it was, and the collision is gone. The trap only appears once the element is passed
*into* a child, which is exactly what an extraction does, so a name that was fine for years fails on
the day you split the component.

## `tsc --noEmit` does not type-check templates

`npx tsc -p tsconfig.spec.json --noEmit` type-checks TypeScript. It does not run the Angular compiler,
so every template error above passes it silently. Three agents reported a clean `tsc` on work whose
`ng test` build failed immediately on a template expression.

The build is the gate. `ng test --watch=false` (or `ng build`) compiles templates; `tsc` is a fast
pre-filter and nothing more. Never accept, or report, a `tsc` run as verification of a change that
touched a template.

## Test hosts for signal inputs need real signals

A host component that holds plain mutable fields and binds them to a child's `input()` renders once
and then never updates: assigning to the field is invisible to the signal graph, so a spec that
mutates state after the first render asserts against stale DOM. Make the host's fields `signal()` and
bind those.

The same rule reaches Signal Forms: `form()` calls `inject()` internally, so a host that builds one
outside an injection context throws. In a spec, wrap it:

```ts
const model = signal<BoxFormData>(blankBox());
const boxForm = TestBed.runInInjectionContext(() => form(model));
```

## Extraction checklist

- Children take `input()`/`output()` and do **not** inject the store; the parent keeps every store
  call and translates child events into it.
- Types and blank-factory helpers the children need are exported from the parent rather than
  redeclared, so one shape stays one shape.
- Move each CSS rule with the markup that uses it; duplicate what more than one component renders.
- The parent's existing spec should keep passing untouched. If it does not, the DOM changed and the
  extraction was not pure: fix the component, never the assertion.
- Verify with `ng test --watch=false`, never with `tsc` alone.
