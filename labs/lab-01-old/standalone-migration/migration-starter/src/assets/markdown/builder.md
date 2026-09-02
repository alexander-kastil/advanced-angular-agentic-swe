FormBuilder can shorten form creation:

```typescript
personForm = this.fb.group({
    id: [0],
    name: ['', { validators: [Validators.required] }],
    age: [0, { validators: [Validators.min(1)] }],
    email: ['', { validators: [Validators.email] }],
    gender: ['', { validators: [Validators.pattern(this.genderPattern)] }],
    wealth: [''],
});
```