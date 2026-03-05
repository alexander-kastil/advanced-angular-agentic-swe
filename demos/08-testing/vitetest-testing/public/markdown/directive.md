# Test Directive — CapitalizeDirective

Test attribute directives by creating a host component in TestBed and asserting DOM changes caused by the directive.

## Spec file

Navigate to `directive/` and examine `capitalize.directive.spec.ts`

```typescript
@Directive({
  selector: "[appCapitalize]",
})
export class CapitalizeDirective {
  el = inject(ElementRef);

  @HostListener("click") onClick() {
    this.el.nativeElement.style.textTransform === "uppercase" ? (this.el.nativeElement.style.textTransform = "lowercase") : (this.el.nativeElement.style.textTransform = "uppercase");
  }
}
```

## Key Concepts

- Create a host component in TestBed to hold the directive
- Query the element with `fixture.nativeElement.querySelector()`
- Assert DOM state changes caused by the directive
- Use `@HostListener` to respond to events
