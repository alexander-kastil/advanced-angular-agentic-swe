import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { FoodItem } from '../food.model';

@Injectable({
  providedIn: 'root',
})
export class FoodEntityService extends EntityCollectionServiceBase<FoodItem> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Food', serviceElementsFactory);
  }
}
