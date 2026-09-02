import { Component, linkedSignal, signal } from '@angular/core';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';

@Component({
    selector: 'app-linked-signal-reset',
    imports: [BoxedDirective],
    template: `
    <div boxed>
      <div>
        <p>Base Signal: {{ baseValue() }}</p>
        <p>Linked Signal (writable): {{ linkedValue() }}</p>
        <p>Sync Status: {{ syncStatus() }}</p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button type="button" class="btn btn-primary" (click)="updateBase()">
          Update Base
        </button>
        <button type="button" class="btn btn-primary" (click)="updateLinked()">
          Update Linked
        </button>
        <button type="button" class="btn btn-primary" (click)="resetLinked()">
          Reset Linked
        </button>
      </div>
    </div>
  `
})
export class LinkedSignalResetComponent {
    baseValue = signal({ count: 0, label: 'Initial' });
    linkedValue = linkedSignal(() => this.baseValue());
    syncStatus = signal('in-sync');

    updateBase() {
        const current = this.baseValue();
        this.baseValue.set({ count: current.count + 1, label: 'Updated' });
        this.syncStatus.set('in-sync');
    }

    updateLinked() {
        const current = this.linkedValue();
        this.linkedValue.set({ count: current.count + 10, label: 'Modified' });
        this.syncStatus.set('out-of-sync');
    }

    resetLinked() {
        this.linkedValue.set(this.baseValue());
        this.syncStatus.set('reset');
    }
}
