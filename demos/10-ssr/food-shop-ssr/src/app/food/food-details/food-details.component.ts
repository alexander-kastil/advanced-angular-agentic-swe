import { JsonPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { FoodItem } from '../food.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-food-details',
  imports: [JsonPipe, RouterModule, MatButtonModule],
  templateUrl: './food-details.component.html',
  styleUrl: './food-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodDetailsComponent {
  private route = inject(ActivatedRoute);
  private id = toSignal(this.route.paramMap.pipe(map(params => Number(params.get('id')))));
  item = httpResource<FoodItem>(() => `${environment.api}food/${this.id()}`);
}
