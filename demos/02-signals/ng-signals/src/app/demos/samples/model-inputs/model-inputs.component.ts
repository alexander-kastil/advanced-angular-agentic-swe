import { Component, signal } from '@angular/core';
import { DetailCardModelComponent } from './detail-card-model/detail-card-model.component';

@Component({
  selector: 'app-model-inputs',
  imports: [DetailCardModelComponent],
  templateUrl: './model-inputs.component.html',
  styleUrl: './model-inputs.component.scss'
})
export class ModelInputsComponent {
  expandedState = signal(false);
}
