# Mock Signal Store — markdownEditorStore

Mock the `markdownEditorStore` when testing components that depend on it.

## Spec file

Navigate to `mock-signals-store/` and examine the test file.

## Key Concepts

- Provide a plain object with `signal()` properties matching the real store interface
- Use `vi.fn()` for any method the component calls (e.g., `dispatch()`)
- Mutate signals to simulate loading / error / success states during tests
- Inject the fake store via `TestBed.configureTestingModule()` providers
- Assert component behavior based on controlled signal values
