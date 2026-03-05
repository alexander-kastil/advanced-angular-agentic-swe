import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';

@Component({
  selector: 'app-control-flow',
  imports: [
    MatSlideToggleModule,
    ReactiveFormsModule,
    BoxedDirective
  ],
  templateUrl: './control-flow.component.html',
  styleUrl: './control-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlFlowComponent {
  fcDisplay = new FormControl(true);
  dogs = signal<string[]>([]);

  constructor() {
    setTimeout(() => {
      this.dogs.set(["Flora", "Cleo", "Soi", "Giro"]);
    }, 5000);
  }
}
