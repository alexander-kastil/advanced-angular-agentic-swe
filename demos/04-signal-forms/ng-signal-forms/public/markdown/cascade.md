Examine the cascade controls in `signal-form-cascade.component.ts`:

```typescript
profileForm = form(this.profileModel, (s) => {
  applyEach(s.skills, (_item) => {});
});

getCriteria(techType: string): string[] {
  return this.selectValues
    .find((s) => s.type === techType)
    ?.values ?? [];
}
```

The second `mat-select` options are derived from the first selection using `getCriteria()`.
