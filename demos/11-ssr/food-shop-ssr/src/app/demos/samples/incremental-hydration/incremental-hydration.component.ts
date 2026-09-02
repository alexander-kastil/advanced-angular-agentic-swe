import { Component, computed, inject } from '@angular/core';
import { HydrationProbeComponent } from './hydration-probe/hydration-probe.component';
import { HydrationLogService } from './hydration-log.service';
import { CodePanelComponent } from '../../../shared/code-panel/code-panel.component';

@Component({
  selector: 'app-incremental-hydration',
  imports: [HydrationProbeComponent, CodePanelComponent],
  templateUrl: './incremental-hydration.component.html',
  styleUrl: './incremental-hydration.component.scss',
})
export class IncrementalHydrationComponent {
  private readonly log = inject(HydrationLogService);

  readonly labels = ['immediate', 'on viewport', 'on interaction', 'never'];
  readonly hydrated = this.log.hydrated;

  readonly pending = computed(() => this.labels.filter((label) => !this.hydrated()[label]));

  readonly config = `provideClientHydration(withEventReplay())`;

  readonly template = `@defer (hydrate on interaction) {
  <app-hydration-probe label="on interaction" />
} @placeholder {
  <div class="skeleton">not sent to the browser yet</div>
}`;

  status(label: string): string {
    const at = this.hydrated()[label];
    return at === undefined ? 'dehydrated, server HTML only' : `hydrated at ${at} ms`;
  }
}
