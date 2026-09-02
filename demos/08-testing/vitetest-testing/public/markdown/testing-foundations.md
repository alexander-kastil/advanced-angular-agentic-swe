# Testing Foundations

Everything you can test with plain `new` and no `TestBed`: a class, a pipe, a service with no dependencies, and a component's own logic.

## The Vitest skeleton

- `describe()` groups related tests
- `it()` is one test case
- `expect()` asserts
- `beforeEach()` builds a fresh subject before every test

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { SimpleClass } from "./simple-class";

describe("Class - Hello world Test", () => {
  let sc: SimpleClass;

  beforeEach(() => (sc = new SimpleClass()));

  it("says Hello World!", () => expect(sc.sayHelloWorld()).toEqual("Hello World!"));
});
```

## Assertions you will reach for

```typescript
expect(5 + 5).toBe(10);
expect({ a: 1 }).toEqual({ a: 1 });
expect(value).toBeTruthy();
expect(list).toHaveLength(3);
expect(list).toContain("Angular");
expect(() => risky()).toThrowError("Voucher details are missing");
```

`voucher-validator.spec.ts` shows the error path: import the fixture data from `voucher-validator.data.ts` so the spec stays about behaviour, not about building objects.

## Pipes

A pipe is a class with a `transform` method. Instantiate it and call it.

```typescript
describe("Pipe - Phonenumber", () => {
  let pipe: PhonenumberPipe;

  beforeEach(() => (pipe = new PhonenumberPipe()));

  it("should display in phone format", () => {
    expect(pipe.transform("3333333333")).toBe("(333) 333 3333");
  });

  it("should throw error if no input is passed", () => {
    expect(() => pipe.transform(undefined)).toThrowError("No input provided to phone pipe");
  });
});
```

`rating.pipe.spec.ts` does the same for a `switch` based pipe, including both thrown errors.

## Services without dependencies

`SimpleMessageService` injects nothing, so no `TestBed` is needed either.

```typescript
beforeEach(() => (service = new SimpleMessageService()));

it("should delete the correct item", () => {
  service.messages = msgs;
  service.delete("Hello World");
  expect(service.messages.length).toBe(2);
  expect(service.messages).toContain("Szia World");
});
```

Only reach for `TestBed.inject()` once the service has injected dependencies to replace.

## Component classes

A component whose logic touches no DOM can be tested the same way.

```typescript
beforeEach(() => (component = new ComponentClassComponent()));

it("should add a skill to the list", () => {
  component.addSkill({ id: 10, name: "NgRx", completed: false });
  expect(component.skills()).toHaveLength(3);
});
```

Signals read as functions: `component.skills()`. No `fixture`, no `detectChanges()`, no change detection at all.

## When this is no longer enough

Move to `TestBed` as soon as the test needs the template, dependency injection, or an input signal set from outside.
