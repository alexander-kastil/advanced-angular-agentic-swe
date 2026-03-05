# Modern Template Features (v21.1 & v21.2)

Arrow functions and spread syntax bring modern JavaScript capabilities directly to Angular templates.

## Arrow Functions in Template Expressions (v21.2)

Write function logic directly in templates without creating wrapper methods.

### Before (Wrapper Method Required)

```typescript
export class MyComponent {
  count = signal(0);

  // Had to create wrapper method just to pass a function
  incrementCount() {
    this.count.update((n) => n + 1);
  }
}
```

```html
<!-- Had to call wrapper method -->
<button (click)="incrementCount()">+1</button>
```

### After (Direct Arrow Function)

```html
<!-- Now use arrow function directly -->
<button (click)="count.update(n => n + 1)">+1</button>
<button (click)="count.update(n => n * 2)">× 2</button>
```

## Spread Syntax in Templates (v21.1)

Use spread operator and rest parameters directly in template expressions.

### Object Spread

```typescript
export class MyComponent {
  products = signal<Product[]>([...]);

  applyDiscount = (items: Product[], percent: number) =>
    items.map(p => ({ ...p, price: p.price * (1 - percent / 100) }));
}
```

```html
<!-- Call method with spread inside - works seamlessly -->
@for (product of applyDiscount(products(), 10); track product.id) {
<div>{{ product.name }} - ${{ product.price }}</div>
}
```

### Array Spread

```typescript
combineArrays = (arr1: string[], arr2: string[]) => [...arr1, ...arr2];
```

### Rest Parameters

```typescript
const sum = (...numbers: number[]) => numbers.reduce((a, b) => a + b, 0);
```

```html
<!-- Rest parameters in template function calls -->
<p>Sum: {{ sum(1, 2, 3, 4, 5) }}</p>
```

## Combined: Arrow Functions + Spread + Signals

Powerful combinations for reactive UI updates:

```typescript
products = signal<Product[]>([...]);

applyDiscount = (items: Product[], percent: number) =>
  items.map(p => ({ ...p, price: p.price * (1 - percent / 100) }));
```

```html
<!-- Update signal with arrow function that uses spread -->
<button (click)="products.update(items => applyDiscount(items, 15))">Apply 15% Discount</button>
```

## Key Benefits

- **No Wrapper Methods:** Write `count.update(n => n + 1)` directly instead of creating methods
- **Shorter Templates:** Less boilerplate in component logic
- **Functional Style:** Use functional programming patterns (map, filter, reduce, spread)
- **Reactive Updates:** Combine with signal.update() for concise state mutations
- **Type-Safe:** Full TypeScript support with templates

## Compatibility

| Feature                      | Introduced | Status     |
| ---------------------------- | ---------- | ---------- |
| Arrow functions in templates | v21.2      | ✅ Current |
| Spread syntax in templates   | v21.1      | ✅ Current |

## Related Concepts

- **Signal Updates:** `signal.update(fn)` with functional transformations
- **Computed Values:** Automatically react to signal changes
- **Control Flow:** Use `@for`, `@if`, `@switch` with these expressions
