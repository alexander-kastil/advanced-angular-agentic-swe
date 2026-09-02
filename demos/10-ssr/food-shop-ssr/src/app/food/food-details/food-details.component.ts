import { Component, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { FoodItem } from '../food.model';
import { EuroPipe } from '../../shared/euro.pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-food-details',
  imports: [RouterLink, MatButtonModule, MatCardModule, EuroPipe],
  templateUrl: './food-details.component.html',
  styleUrl: './food-details.component.scss',
})
export class FoodDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly id = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id'))))
  );

  readonly item = httpResource<FoodItem>(() => `${environment.api}food/${this.id()}`);
}
