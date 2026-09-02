import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { FoodItem } from '../food.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FoodDataService extends DefaultDataService<FoodItem>{

  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Food', http, httpUrlGenerator);
  }

  override add(food: FoodItem): Observable<FoodItem> {
    console.log('overriding add');
    return this.http.post<FoodItem>(`${environment.api}/food`, food).pipe(
      map((data) => {
        return { ...food, id: data.id };
      })
    );
  }
}
