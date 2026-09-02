import { Component, computed, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';

type Status = 'idle' | 'running' | 'failed';

interface Dog {
  id: number;
  name: string;
  breed: string;
  age: number;
}

@Component({
  selector: 'app-control-flow',
  templateUrl: './control-flow.component.html',
  styleUrl: './control-flow.component.scss',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButton,
    MatSlideToggle,
    BoxedDirective,
  ],
})
export class ControlFlowComponent {
  readonly membersOnly = signal(true);
  readonly status = signal<Status>('idle');
  readonly count = signal(0);
  readonly multiplier = signal(2);

  readonly dogs = signal<Dog[]>([
    { id: 1, name: 'Flora', breed: 'Greyhound', age: 14 },
    { id: 2, name: 'Cleo', breed: 'Saluki', age: 15 },
    { id: 3, name: 'Soi', breed: 'Whippet', age: 9 },
    { id: 4, name: 'Giro', breed: 'Galgo Espanol', age: 11 },
  ]);

  readonly averageAge = computed(() => {
    const list = this.dogs();
    return list.length ? list.reduce((sum, d) => sum + d.age, 0) / list.length : 0;
  });

  readonly ageAllBy = (dogs: Dog[], years: number) =>
    dogs.map((dog) => ({ ...dog, age: dog.age + years }));

  cycleStatus() {
    const order: Status[] = ['idle', 'running', 'failed'];
    this.status.update((current) => order[(order.indexOf(current) + 1) % order.length]);
  }
}
