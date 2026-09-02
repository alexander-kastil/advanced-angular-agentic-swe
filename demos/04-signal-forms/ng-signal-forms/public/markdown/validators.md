Async validation runs only after every synchronous validator on the field passes. Angular 22 ships two entry points.

**`validateHttp()`** is the shortest path when the check is a plain HTTP call. It builds an `httpResource` for you:

```typescript
validateHttp<string, Person[]>(s.email, {
  request: ({ value }) => (value() ? `${environment.api}persons?email=${encodeURIComponent(value())}` : undefined),
  debounce: 400,
  onSuccess: (persons) => (persons.length > 0 ? { kind: "mailExists", message: "This mail is already registered" } : null),
  onError: () => ({ kind: "serverError", message: "Could not verify the email" }),
});
```

Returning `undefined` from `request` keeps the validator idle, so nothing is fetched for an empty field.

**`validateAsync()`** is the general form: you supply the resource yourself, which lets you reuse a service, an `rxResource`, or any other `Resource`:

```typescript
validateAsync(s.name, {
  params: ({ value }) => value() || undefined,
  debounce: 400,
  factory: (name) =>
    rxResource({
      params: () => name(),
      stream: ({ params }) => this.ps.checkNameTaken(params),
    }),
  onSuccess: (taken) => (taken ? { kind: "nameTaken", message: "This name is already taken" } : null),
  onError: () => ({ kind: "serverError", message: "Could not verify the name" }),
});
```

While a request is in flight the field reports `pending()`, which is what disables the submit button here.

Start `json-server db.json` first, then try the name `Soi` or the email `cleothewhippet@integrations.at`.
