import { Component, signal } from '@angular/core';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';
import { IdlePanelComponent } from './idle-panel/idle-panel.component';
import { InteractionPanelComponent } from './interaction-panel/interaction-panel.component';
import { TimerPanelComponent } from './timer-panel/timer-panel.component';

@Component({
  selector: 'app-defer-idle-timeout',
  templateUrl: './defer-idle-timeout.component.html',
  styleUrl: './defer-idle-timeout.component.scss',
  imports: [
    BoxedDirective,
    IdlePanelComponent,
    TimerPanelComponent,
    InteractionPanelComponent,
  ],
})
export class DeferIdleTimeoutComponent {
  readonly mounted = signal(true);
  readonly mountedAt = signal(new Date().toLocaleTimeString());

  remount() {
    this.mounted.set(false);
    setTimeout(() => {
      this.mountedAt.set(new Date().toLocaleTimeString());
      this.mounted.set(true);
    });
  }
}
