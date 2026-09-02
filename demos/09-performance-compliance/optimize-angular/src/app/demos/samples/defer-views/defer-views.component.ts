import { Component, signal } from '@angular/core';
import { RevenueChartComponent } from './revenue-chart.component';

@Component({
  selector: 'app-defer-views',
  templateUrl: './defer-views.component.html',
  styleUrls: ['./defer-views.component.scss'],
  imports: [RevenueChartComponent]
})
export class DeferViewsComponent {
  readonly armed = signal(false);

  arm() {
    this.armed.set(true);
  }
}
