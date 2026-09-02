import { Component } from '@angular/core';

@Component({
  selector: 'app-overview-stage',
  template: `
    <div class="stage overview" animate.enter="stage-enter" animate.leave="stage-leave">
      <h3>Overview</h3>
      <p>
        This element carries <code>animate.enter</code> and <code>animate.leave</code>. The router
        creates it when the child route activates and Angular waits for the leave animation to
        finish before removing it.
      </p>
    </div>
  `,
  styleUrls: ['./stage.scss'],
})
export class OverviewStageComponent {}
