# Signal Interop, Both Ways

There are exactly four crossings between signals and Observables in Angular 22, and all four are in `@angular/core/rxjs-interop`. Each pane in the demo is labelled with the direction it goes.

| API | Direction |
| --- | --- |
| `toSignal()` | Observable &rarr; Signal |
| `toObservable()` | Signal &rarr; Observable |
| `outputToObservable()` | `output()` &rarr; Observable |
| `outputFromObservable()` | Observable &rarr; `output()` |

## toSignal: Observable to Signal

```typescript
protected clock = toSignal(interval(1000).pipe(map(...)), { initialValue: '...' });
```

Subscribes on creation, unsubscribes on destroy, and gives you a synchronous read. Supply `initialValue` or the signal type includes `undefined`. One subscription no matter how many times the template reads it.

## toObservable: Signal to Observable

```typescript
protected settledTerm = toSignal(toObservable(this.term).pipe(debounceTime(400)), {
  initialValue: '',
});
```

Use it when you need an operator that has no signal equivalent, which in practice means anything about time: `debounceTime`, `throttleTime`, `bufferTime`, retry with backoff. The demo shows the raw signal and the settled value side by side so the 400 ms gap is visible.

`toObservable` uses an effect internally, so it emits on the microtask after the change, not synchronously, and it drops intermediate values written in the same tick.

## outputToObservable: output() to Observable

```typescript
effect((onCleanup) => {
  const subscription = outputToObservable(this.pinger().pinged)
    .pipe(scan((entries: string[], time) => [time, ...entries].slice(0, 5), []))
    .subscribe((entries) => this.pings.set(entries));
  onCleanup(() => subscription.unsubscribe());
});
```

A child's `output()` consumed as a stream so operators can shape it. It is wrapped in an `effect` because `viewChild()` is only populated after the view is created, and `onCleanup` is what keeps the subscription honest.

Reach for it when you need an operator over a child's events: debounce a save button, `pairwise()` over selections, `bufferTime()` over a drag.

## outputFromObservable: Observable to output()

```typescript
@Component({ selector: 'app-heartbeat', template: `...` })
export class HeartbeatComponent {
  readonly beat = outputFromObservable(
    interval(2000).pipe(map((i) => `beat ${i + 1} ...`)),
  );
}
```

The mirror image, and the one people forget exists. The child already has a stream; instead of subscribing to it and re-emitting through an `output()`, declare the output **as** the stream. The parent binds `(beat)="onBeat($event)"` and never learns there is RxJS behind it.

It must be called in an injection context, and it unsubscribes when the component is destroyed.

## rxResource: not a direction, a replacement

```typescript
protected skillsResource = rxResource({
  params: () => this.settledTerm(),
  stream: ({ params }) => this.skills.getSkills().pipe(map(...)),
  defaultValue: [],
});
```

`params` is the reactive trigger. When it changes, the previous stream is unsubscribed and a new one starts, so cancellation is automatic. You get `value()`, `isLoading()`, `error()` and `reload()` without writing a status machine.

This is why you rarely need the four crossings for HTTP at all: `rxResource` already spans the boundary for request and response. Keep the four for events and time.

## Which one

Cross into signals as early as you can and stay there. The stream is the right tool at the edge, where events and time live; the signal is the right tool in the component, where rendering lives.
