# Directive Composition

The Directive Composition API lets a directive or a component pull other directives onto its own host element through `hostDirectives`. The host element gets every behaviour without the template ever naming the pieces.

## The chain in this demo

`src/app/shared/formatting/formatting-directives.ts` builds one directive out of four:

```typescript
@Directive({
  selector: '[border]',
  host: { 'style': 'border:1px solid var(--color-accent); padding: var(--gap-medium)' },
})
export class BorderDirective {}

@Directive({
  selector: '[height-medium]',
  host: { 'style': 'height:100px;' },
  hostDirectives: [BorderDirective],
})
export class HeightDirective {}

@Directive({
  selector: '[full-width]',
  host: { style: 'width:100%;' },
  hostDirectives: [HeightDirective],
})
export class WidthDirective {}

@Directive({
  selector: '[boxed]',
  hostDirectives: [FontBoldDirective, WidthDirective],
})
export class BoxedDirective {}
```

`hostDirectives` composes transitively, so `boxed` applies bold, then width, then height, then border.

## Using it

```html
<div boxed>My layout is done using the "boxed" directive</div>
```

```typescript
@Component({
  selector: 'app-directive-composition',
  templateUrl: './directive-composition.component.html',
  imports: [BoxedDirective],
})
export class DirectiveCompositionComponent {}
```

Only the directive you write in the template is imported. The composed ones travel with it and are never named by the consumer.

## Rules worth knowing

| Rule | Why |
| --- | --- |
| Composed directives must be standalone | `hostDirectives` has no NgModule to resolve them from |
| Composition is applied before the host's own bindings | the host wins on a conflicting binding |
| Inputs and outputs are not exposed by default | list them explicitly with `inputs: [...]` / `outputs: [...]` in the `hostDirectives` entry |
| The selector of a composed directive is ignored | it is applied because it is listed, not because it matched |
