import { httpResource } from '@angular/common/http';
import { Component, computed, effect, linkedSignal, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { environment } from '../../../../environments/environment';
import { BorderDirective } from '../../../shared/formatting/formatting-directives';
import { Skill } from '../../../skills/skill.model';

@Component({
  selector: 'app-devtools-signal-graph',
  imports: [MatButton, BorderDirective],
  templateUrl: './devtools-signal-graph.component.html',
  styleUrl: './devtools-signal-graph.component.scss',
})
export class DevtoolsSignalGraphComponent {
  readonly ticks = signal(0, { debugName: 'ticks' });
  readonly weight = signal(2, { debugName: 'weight' });
  readonly running = signal(false, { debugName: 'running' });
  readonly effectRuns = signal(0, { debugName: 'effectRuns' });

  readonly score = computed(() => this.ticks() * this.weight(), { debugName: 'score' });

  readonly band = computed(
    () => (this.score() < 10 ? 'low' : this.score() < 30 ? 'medium' : 'high'),
    { debugName: 'band' },
  );

  readonly threshold = linkedSignal<string, number>({
    source: () => this.band(),
    computation: (band) => (band === 'high' ? 30 : band === 'medium' ? 10 : 0),
    debugName: 'threshold',
  });

  readonly skills = httpResource<Skill[]>(
    () => `${environment.api}skills?completed=${this.band() !== 'low'}`,
    { defaultValue: [], debugName: 'skillsByBand' },
  );

  readonly headline = computed(
    () => `${this.band()} band, threshold ${this.threshold()}, ${this.skills.value().length} skills`,
    { debugName: 'headline' },
  );

  constructor() {
    effect(
      (onCleanup) => {
        if (!this.running()) {
          return;
        }
        const handle = setInterval(() => this.ticks.update((t) => t + 1), 600);
        this.effectRuns.update((r) => r + 1);
        onCleanup(() => clearInterval(handle));
      },
      { debugName: 'tickerEffect' },
    );
  }

  toggle() {
    this.running.update((r) => !r);
  }

  bumpWeight() {
    this.weight.update((w) => (w >= 5 ? 1 : w + 1));
  }

  raiseThreshold() {
    this.threshold.update((t) => t + 5);
  }

  reset() {
    this.ticks.set(0);
    this.weight.set(2);
    this.running.set(false);
  }
}
