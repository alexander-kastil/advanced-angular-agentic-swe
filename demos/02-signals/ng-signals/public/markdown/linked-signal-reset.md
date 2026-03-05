- `linkedSignal()` creates a **writable derived signal** that stays in sync with a source signal but allows independent updates:

```typescript
baseValue = signal({ count: 0 });
linkedValue = linkedSignal(() => this.baseValue());
```

- When `baseValue` updates, `linkedValue` automatically syncs to the new value (unless manually changed)

- You can then update `linkedValue` independently:

```typescript
linkedValue.set({ count: 100 }); // Override the linked value
```

- Common use case: **Reset** a linked signal back to its source:

```typescript
reset() {
  linkedValue.set(baseValue());
}
```

- Useful for edit-in-place patterns where you buffer changes before committing:
  - Source signal = server data
  - Linked signal = local form edits
  - Click "Save" → update source
  - Click "Cancel" → reset linked signal

- **Key difference from computed():** linkedSignal is **writable**, computed is read-only
