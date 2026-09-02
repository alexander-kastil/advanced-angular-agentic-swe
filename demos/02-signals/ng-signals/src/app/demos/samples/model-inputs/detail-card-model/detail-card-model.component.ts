import { Component, model } from '@angular/core';

@Component({
  selector: 'app-detail-card-model',
  templateUrl: './detail-card-model.component.html',
  styleUrl: './detail-card-model.component.scss'
})
export class DetailCardModelComponent {
  expanded = model(false);

  toggle() {
    this.expanded.set(!this.expanded());
  }

}
