import { Component } from '@angular/core';

@Component({
  selector: 'app-details-stage',
  template: `
    <div class="stage details" animate.enter="stage-enter" animate.leave="stage-leave">
      <h3>Details</h3>
      <p>
        A different component, so the outlet destroys the previous one. That destruction is what
        triggers <code>animate.leave</code>; a component reused across a parameter change would not
        animate at all.
      </p>
    </div>
  `,
  styleUrls: ['./stage.scss'],
})
export class DetailsStageComponent {}
