# Test Pipe — PhonenumberPipe

Unit test Angular pipes in isolation by instantiating the pipe class directly and asserting transform output.

## Spec file

Navigate to `pipe/` and examine `phonenumber.pipe.spec.ts`

```typescript
const pipe = new PhonenumberPipe();
expect(pipe.transform("1234567890")).toBe("(123) 456 7890");
expect(pipe.transform("abc")).toBe("");
```

## Key Concepts

- Pipes are plain classes — instantiate directly without TestBed
- Call `.transform()` with test inputs and assert output
- Test edge cases: undefined, wrong length, valid input
- No DOM or Angular setup required
