import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-detail-card-model',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './detail-card-model.component.html',
  styleUrl: './detail-card-model.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailCardModelComponent {
  expanded = model(false);

  toggle() {
    console.log('toggling');
    this.expanded.set(!this.expanded());
  }

}
