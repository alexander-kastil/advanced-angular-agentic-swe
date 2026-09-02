# Debounce Three Ways

The same 500 ms delay, expressed at three different levels of the framework. Type four characters quickly into all three boxes and read the counters: **4 keystrokes, 1 settled value** in every pane. What differs is the ceremony, and what the framework hands you while you wait.

## 1. debounceTime()

```typescript
protected control = new FormControl('', { nonNullable: true });
protected rawControl = toSignal(this.control.valueChanges, { initialValue: '' });
protected debouncedControl = toSignal(
  this.control.valueChanges.pipe(debounceTime(500)),
  { initialValue: '' },
);
protected controlPending = computed(() => this.rawControl() !== this.debouncedControl());
```

The classic pipeline. It needs a control that emits, an operator, and `toSignal()` to get the value back into the template. There is no pending state: the demo derives one by comparing the raw and settled signals, which means a **second** subscription to `valueChanges` just to know that a wait is in progress.

Every RxJS operator is available once you are in the pipe, which is the reason to be here at all.

## 2. debounced()

```typescript
protected typed = signal('');
protected debouncedSignal = debounced(this.typed, 500);
```

`debounced()` from `@angular/core` takes a signal and returns a `Resource<T>`. No stream, no subscription, no conversion back. Because it is a resource, the wait is a first-class state:

```html
{{ debouncedSignal.isLoading() ? 'isLoading() is true ...' : '' }}
{{ debouncedSignal.value() }}
```

The `wait` argument is typed `number | ((value, lastValue) => Promise<void> | void)`, so the delay can be something other than a timer: wait for a network idle, wait for an animation, wait for a lock.

Experimental in 22.0.

## 3. Signal Forms debounce()

```typescript
protected searchForm = form(this.model, (path) => {
  debounce(path.query, 500);
});
```

Declared as form logic next to `required()` and `disabled()`, so the delay lives with the rest of the field's rules instead of in the component body.

The field keeps two values while it waits, and the demo prints both:

- `searchForm.query().controlValue()` is the control's own value, never debounced. This is what keeps the input responsive.
- `model().query` is the data model, written late.

`debounce(path, 'blur')` waits for blur instead of a timer, and a `Debouncer` function covers everything else.

## Choosing

Use the Signal Forms rule when the value is a form field. Use `debounced()` when it is a plain signal and you want the pending state for free. Drop into `debounceTime()` when the delay is one step in a longer pipeline that needs other operators anyway, which is exactly the case in `rxresource-vs-switchmap`.
