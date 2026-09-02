import { Component } from '@angular/core';

@Component({
  selector: 'app-interaction-panel',
  template: `
    <div class="panel">
      <strong>Interaction panel</strong>
      <p>Loaded at {{ loadedAt }} on the first click, or after 10 seconds if nobody clicks.</p>
    </div>
  `,
  styles: `
    .panel {
      border-left: 4px solid #6a1b9a;
      padding: 8px 12px;
    }
    p {
      margin: 4px 0 0;
    }
  `,
})
export class InteractionPanelComponent {
  readonly loadedAt = new Date().toLocaleTimeString();
}
