import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DetailCardModelComponent } from './detail-card-model/detail-card-model.component';

@Component({
  selector: 'app-model-inputs',
  imports: [MatButtonModule, DetailCardModelComponent],
  templateUrl: './model-inputs.component.html',
  styleUrl: './model-inputs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelInputsComponent {
  expandedState = signal(false);
}
