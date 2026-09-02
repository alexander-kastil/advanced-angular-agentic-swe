BoxDirective uses the Angular 15+ Directive Composition Api

```typescript
@Directive({
  selector: '[boxed]',
  hostDirectives: [RedColorDirective, FontBoldDirective, WidthDirective, CenteredDirective],
})
export class BoxedDirective {
  constructor() {}
}
```

Use in component:

```html
<div boxed>
    My layout is done using the "boxed" directive
</div>
```