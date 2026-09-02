import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { outputToObservable, rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { debounceTime, interval, map, scan } from 'rxjs';
import { HeartbeatComponent } from './heartbeat.component';
import { PingerComponent } from './pinger.component';
import { SkillsService } from '../../skills/skills.service';

@Component({
  selector: 'app-interop',
  templateUrl: './interop.component.html',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatChipSet,
    MatChip,
    MatProgressBar,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    PingerComponent,
    HeartbeatComponent,
  ],
  styles: `
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .log { font-family: monospace; font-size: 0.82rem; }
    .direction { font-size: 0.75rem; letter-spacing: 0.04em; opacity: 0.7; }
    .bridge { margin-top: 16px; }
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
