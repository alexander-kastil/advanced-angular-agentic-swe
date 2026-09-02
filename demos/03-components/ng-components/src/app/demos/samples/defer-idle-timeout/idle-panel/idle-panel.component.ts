import { Component } from '@angular/core';

@Component({
  selector: 'app-idle-panel',
  template: `
    <div class="panel">
      <strong>Idle panel</strong>
      <p>Loaded at {{ loadedAt }} because the browser reported an idle callback.</p>
    </div>
  `,
  styles: `
    .panel {
      border-left: 4px solid #2e7d32;
      padding: 8px 12px;
    }
    p {
      margin: 4px 0 0;
    }
  `,
})
export class IdlePanelComponent {
  readonly loadedAt = new Date().toLocaleTimeString();
}
