# Input Signals & Outputs — CustomerEditComponent

Test `CustomerEditComponent` which has a required customer signal input and save/cancel outputs.

## Spec file

Navigate to `component-input-signals/` and examine the test file.

## Key Concepts

- `fixture.componentRef.setInput()` works for required `input()` signals
- Changing the input resets any `linkedSignal()` derived state — verify via DOM values
- Subscribe to `output()` signals with a spy before triggering events
- Test disabled state via `button.disabled` attribute
- Verify that input changes trigger component re-rendering and output emissions
