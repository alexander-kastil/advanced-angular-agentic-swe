# Control Flow and Template Syntax

Built-in control flow blocks replace the structural directives. They need no import, they are part of the compiler, and `track` is mandatory on `@for`.

## @if / @else

```html
@if (membersOnly()) {
  <p>Members area content</p>
} @else {
  <p>Public area content</p>
}
```

## @for with @empty

`track` is required. Use a stable identity, not `$index`, whenever the rows have one.

```html
@for (dog of dogs(); track dog.id) {
  <p>{{ $index + 1 }}. {{ dog.name }}</p>
} @empty {
  <p>No dogs left</p>
}
```

Available inside the block: `$index`, `$first`, `$last`, `$even`, `$odd`, `$count`.

## @let

`@let` names a value inside the template so an expression is computed once instead of repeated in three bindings.

```html
@let average = averageAge().toFixed(1);
<p>Average age: {{ average }}</p>
```

A `@let` is scoped to its block and is read-only.

## @switch

```html
@switch (status()) {
  @case ('idle') { <p>Waiting for work</p> }
  @case ('running') { <p>Work in progress</p> }
  @default { <p>Something went wrong</p> }
}
```

## @defer

`@defer` splits the block into its own chunk and loads it on a trigger.

```html
@defer (on interaction) {
  <app-heavy-panel />
} @placeholder {
  <p>Click to load</p>
} @loading {
  <p>Loading...</p>
}
```

Triggers include `on idle`, `on viewport`, `on interaction`, `on hover`, `on timer(...)` and `when <expression>`.

## Arrow functions and spread in template expressions

Template expressions accept arrow functions and spread syntax, so a signal update no longer needs a wrapper method on the class.

```html
<button (click)="count.update(n => n + 1)">+1</button>
<button (click)="dogs.update(list => ageAllBy(list, 1))">Everyone ages a year</button>
```

```typescript
readonly ageAllBy = (dogs: Dog[], years: number) =>
  dogs.map((dog) => ({ ...dog, age: dog.age + years }));
```

## Migration

An existing app converts with the schematic:

```bash
ng g @angular/core:control-flow
```
