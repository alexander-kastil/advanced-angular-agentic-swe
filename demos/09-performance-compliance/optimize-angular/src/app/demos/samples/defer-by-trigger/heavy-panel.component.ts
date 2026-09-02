import { Component, inject, input, signal } from '@angular/core';
import { DeferTimeline } from './defer-timeline.service';

interface Row {
  iso: string;
  human: string;
}

@Component({
  selector: 'app-heavy-panel',
  template: `
    <div class="panel heavy">
      <strong>{{ label() }}</strong>
      <p>
        Heavy payload. This component pulls <code>moment</code> in with a dynamic
        <code>import()</code>, so the library is fetched the first time any block renders it and is
        served from the module cache for every block after that.
      </p>
      @if (rows().length === 0) {
        <p class="loading">Fetching the moment module...</p>
      } @else {
        <ul>
          @for (row of rows(); track row.iso) {
            <li><code>{{ row.iso }}</code> is <em>{{ row.human }}</em></li>
          }
        </ul>
        <button type="button" (click)="shift()">Shift the window</button>
      }
    </div>
  `,
  styles: `
    .panel { border-left: 4px solid var(--color-warn); padding: 8px 12px; }
    .panel p { margin: 4px 0; color: #55595c; }
    ul { margin: 8px 0; line-height: 1.7; }
    button { padding: 4px 12px; border: 1px solid var(--color-primary); background: transparent; color: inherit; cursor: pointer; }
  `
})
export class HeavyPanelComponent {
  private timeline = inject(DeferTimeline);
  readonly label = input.required<string>();

  private offset = 0;
  readonly rows = signal<Row[]>([]);

  constructor() {
    queueMicrotask(() => this.timeline.record(this.label(), 'heavy-panel'));
    void this.load();
  }

  shift() {
    this.offset += 90;
    void this.load();
  }

  private async load() {
    const { default: moment } = await import('moment');
    const base = moment().add(this.offset, 'days');
    this.rows.set(
      [0, 30, 180].map(days => {
        const point = base.clone().add(days, 'days');
        return { iso: point.format('YYYY-MM-DD'), human: point.fromNow() };
      })
    );
  }
}
