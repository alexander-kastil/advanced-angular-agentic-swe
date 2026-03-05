import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';

interface User {
    id: number;
    name: string;
    age: number;
}

@Component({
    selector: 'app-signal-equality',
    imports: [MatButton, BoxedDirective],
    template: `
    <div boxed>
      <div>
        <p>Count (default equality): {{ count() }}</p>
        <p>User (default equality): {{ user().name }}</p>
        <p>Custom equality computed: {{ computedUser() }}</p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button mat-raised-button color="accent" (click)="updateUser()">
          Update User (same reference)
        </button>
        <button mat-raised-button color="accent" (click)="incrementCount()">
          Increment Count
        </button>
      </div>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignalEqualityComponent {
    count = signal(0);
    user = signal<User>({ id: 1, name: 'Alice', age: 30 }, {
        equal: (a, b) => a.id === b.id && a.name === b.name
    });

    computedUser = computed(() => {
        const u = this.user();
        return `${u.name} (${u.age})`;
    });

    updateUser() {
        const current = this.user();
        this.user.set({ ...current, age: current.age + 1 });
    }

    incrementCount() {
        this.count.update(c => c + 1);
    }
}
