# Hello World Test

Get started with Vitest and Angular testing fundamentals. Write your first unit test for a plain TypeScript class without any Angular complexity.

## Overview

Unit testing basics:

- **describe()** - Groups related tests together
- **it()** - Individual test case
- **expect()** - Assertion that verifies a condition
- **beforeEach()** - Setup that runs before each test

## Your First Test

Examine `simple-class.ts` and `simple-class.spec.ts`:

```typescript
// simple-class.ts
export class SimpleClass {
  sayHelloWorld(): string {
    return "Hello World!";
  }
}
```

```typescript
// simple-class.spec.ts
import { describe, it, expect, beforeEach } from "vitest";
import { SimpleClass } from "./simple-class";

describe("Class - Hello world Test", () => {
  let sc: SimpleClass;

  beforeEach(() => {
    sc = new SimpleClass();
  });

  it("contains 12 characters", () => {
    expect(sc.sayHelloWorld().length).toEqual(12);
  });

  it("says Hello World!", () => {
    expect(sc.sayHelloWorld()).toEqual("Hello World!");
  });
});
```

## Test Structure Breakdown

```typescript
describe("MyFeature", () => {
  // Test group name

  let myObject: MyClass;

  beforeEach(() => {
    // Setup: runs before EACH test case
    myObject = new MyClass();
  });

  it("should do something specific", () => {
    // Arrange: prepare test data (already done in beforeEach)
    // Act: call the method being tested
    const result = myObject.doSomething();

    // Assert: verify the result
    expect(result).toBe("expected value");
  });

  it("should handle edge cases", () => {
    expect(myObject.getValue()).toBeNull();
  });
});
```

## Writing Assertions with expect()

```typescript
// Equality
expect(5 + 5).toBe(10);
expect(true).toEqual(true);
expect({ a: 1 }).toEqual({ a: 1 });

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// String matching
expect("hello world").toContain("world");
expect("hello@example.com").toMatch(/example\.com/);

// Arrays
expect([1, 2, 3]).toHaveLength(3);
expect([1, 2, 3]).toContain(2);

// Exceptions
expect(() => throwingFn()).toThrow();
expect(() => throwingFn()).toThrowError("specific message");
```

## Additional Examples

The module includes more complex class tests in `voucher-validator.ts` and `voucher-validator.spec.ts`:

```typescript
// voucher-validator.ts
export class VoucherValidator {
  isValidVoucher(code: string): boolean {
    return code.length === 5 && code.toUpperCase() === code;
  }
}
```

```typescript
// voucher-validator.spec.ts
describe("VoucherValidator", () => {
  let validator: VoucherValidator;

  beforeEach(() => {
    validator = new VoucherValidator();
  });

  it("returns true for valid voucher code", () => {
    expect(validator.isValidVoucher("ABCDE")).toBe(true);
  });

  it("returns false for lowercase code", () => {
    expect(validator.isValidVoucher("abcde")).toBe(false);
  });

  it("returns false for code too short", () => {
    expect(validator.isValidVoucher("ABC")).toBe(false);
  });

  it("returns false for code too long", () => {
    expect(validator.isValidVoucher("ABCDEF")).toBe(false);
  });
});
```

## Running Tests with Vitest

```bash
# Run all tests once
ng test --watch false

# Run tests in watch mode (re-run on file change)
ng test

# Run tests matching a pattern
ng test --include='**/voucher*'

# Run tests with coverage
ng test --coverage
```

## Key Concepts

- **describe()** - Groups related tests under one test suite name
- **it()** - Individual test case that should pass or fail
- **beforeEach()** - Setup code that runs before each test (for initialization)
- **expect()** - Assertion that verifies behavior; test fails if expectation not met
- **Vitest vs Jasmine** - This module uses Vitest (modern test runner); Jasmine is the assertion library
- **No Angular required** - Class-only tests are simple TypeScript without TestBed
- **Test coverage** - Aim for multiple assertions per method: happy path, edge cases, error conditions
- **Descriptive names** - Test names should be readable: "should...", "returns...", "throws..."
