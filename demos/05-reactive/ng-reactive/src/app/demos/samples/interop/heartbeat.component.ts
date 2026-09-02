import { Component } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-heartbeat',
  template: `<code>beat = outputFromObservable(interval(2000))</code>`,
})
export class HeartbeatComponent {
  readonly beat = outputFromObservable(
    interval(2000).pipe(map((i) => `beat ${i + 1} at ${new Date().toLocaleTimeString()}`)),
  );
}
