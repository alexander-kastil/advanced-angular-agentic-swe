# Class-Only Test — Component Signals

Test component signal state by instantiating the class directly without TestBed. Fast tests for pure logic.

## Spec file

Navigate to `component-class/` and examine the component and test files.

## Key Concepts

- You can test components like ordinary classes without TestBed if you don't need DOM testing
- Instantiate the component directly and call methods
- Assert signal state via `componentInstance.signal()`
- No Angular setup overhead — fast and focused tests
- Ideal for testing computed values and signal transformations without rendering
