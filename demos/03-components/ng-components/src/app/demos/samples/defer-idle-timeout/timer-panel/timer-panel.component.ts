import { Component } from '@angular/core';

@Component({
  selector: 'app-timer-panel',
  template: `
    <div class="panel">
      <strong>Timer panel</strong>
      <p>Loaded at {{ loadedAt }} after the 3 second timer elapsed.</p>
    </div>
  `,
  styles: `
    .panel {
      border-left: 4px solid #1565c0;
      padding: 8px 12px;
    }
    p {
      margin: 4px 0 0;
    }
  `,
})
export class TimerPanelComponent {
  readonly loadedAt = new Date().toLocaleTimeString();
}
