import { Component, computed, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { FoodItem } from '../../../../food/food.model';
import { EuroPipe } from '../../../../shared/euro.pipe';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-dish-params',
  imports: [EuroPipe],
  templateUrl: './dish-params.component.html',
  styleUrl: './dish-params.component.scss',
})
export class DishParamsComponent {
  readonly id = input.required<string>();
  readonly highlight = input('');

  readonly dish = httpResource<FoodItem>(() => `${environment.api}food/${this.id()}`);
  readonly found = computed(() => this.dish.value() ?? null);
}
