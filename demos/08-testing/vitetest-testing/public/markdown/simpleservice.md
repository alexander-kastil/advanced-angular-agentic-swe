# Simple Service — SimpleMessageService

Test a service class without DI by instantiating it directly. Verify add, delete and clear methods and state mutations in isolation.

## Spec file

Navigate to `simple-service/` and examine `simple.service.spec.ts`

```typescript
export class SimpleMessageService {
  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  delete(msg: string) {
    this.messages = this.messages.filter((item) => item !== msg);
  }

  clear() {
    this.messages = [];
  }
}
```

## Key Concepts

- Instantiate the service class directly without TestBed or Angular
- No DI required — plain TypeScript class testing
- Assert state mutations via `service.messages` array
- Test method interactions: add → delete → clear lifecycle
- Fast and simple tests for business logic
