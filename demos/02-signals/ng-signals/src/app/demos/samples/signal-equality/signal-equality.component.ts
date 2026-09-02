import { Component, signal, computed } from '@angular/core';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';

interface User {
    id: number;
    name: string;
    age: number;
}

@Component({
    selector: 'app-signal-equality',
    imports: [BoxedDirective],
    template: `
    <div boxed>
      <div>
        <p>Count (default equality): {{ count() }}</p>
        <p>User (default equality): {{ user().name }}</p>
        <p>Custom equality computed: {{ computedUser() }}</p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button type="button" class="btn btn-primary" (click)="updateUser()">
          Update User (same reference)
        </button>
        <button type="button" class="btn btn-primary" (click)="incrementCount()">
          Increment Count
        </button>
      </div>
    </div>
  `
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
