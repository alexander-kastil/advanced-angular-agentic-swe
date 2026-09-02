import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { outputToObservable, rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, interval, map, scan } from 'rxjs';
import { ProgressBarComponent } from 'src/app/shared/progress-bar/progress-bar.component';
import { HeartbeatComponent } from './heartbeat.component';
import { PingerComponent } from './pinger.component';
import { SkillsService } from '../../skills/skills.service';

@Component({
  selector: 'app-interop',
  templateUrl: './interop.component.html',
  imports: [FormsModule, ProgressBarComponent, PingerComponent, HeartbeatComponent],
  styles: `
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .log { font-family: monospace; font-size: 0.82rem; }
    .direction { font-size: 0.75rem; letter-spacing: 0.04em; color: #64748b; }
    .bridge { margin-top: 16px; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip { display: inline-flex; align-items: center; border-radius: 9999px; background: #eef2f6; padding: 4px 12px; font-size: 0.8125rem; color: #334155; }
    .chip-on { background: var(--color-primary); color: #ffffff; }
    code { font-family: monospace; background: #eef2f6; border-radius: 3px; padding: 0 3px; }
  `,
})
export class InteropComponent {
  private skills = inject(SkillsService);
  private pinger = viewChild.required(PingerComponent);

  protected clock = toSignal(
    interval(1000).pipe(map(() => new Date().toLocaleTimeString())),
    { initialValue: new Date().toLocaleTimeString() },
  );

  protected term = signal('');
  protected settledTerm = toSignal(toObservable(this.term).pipe(debounceTime(400)), {
    initialValue: '',
  });

  protected pings = signal<string[]>([]);
  protected beats = signal<string[]>([]);

  protected skillsResource = rxResource({
    params: () => this.settledTerm(),
    stream: ({ params }) =>
      this.skills
        .getSkills()
        .pipe(
          map((skills) =>
            skills.filter((skill) => skill.name.toLowerCase().includes(params.toLowerCase())),
          ),
        ),
    defaultValue: [],
  });

  constructor() {
    effect((onCleanup) => {
      const subscription = outputToObservable(this.pinger().pinged)
        .pipe(scan((entries: string[], time) => [time, ...entries].slice(0, 5), []))
        .subscribe((entries) => this.pings.set(entries));
      onCleanup(() => subscription.unsubscribe());
    });
  }

  protected onBeat(beat: string) {
    this.beats.update((entries) => [beat, ...entries].slice(0, 5));
  }
}
