import { Component, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CounterComponent } from './counter.component';

@Component({
    selector: 'app-component-write',
    templateUrl: 'component-write.component.html',
    styleUrls: ['./component-write.component.scss'],
    imports: [
        FormsModule,
        CounterComponent,
    ]
})
export class ComponentWriteComponent {
    user: Signal<userType> = signal({ username: 'Giro the hunter from Spain', id: 1 });
}

export type userType = { username: string, id: number }
