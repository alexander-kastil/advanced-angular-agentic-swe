import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DemoItem } from './demo-item.model';

@Injectable({ providedIn: 'root' })
export class DemoService {
  constructor(private httpClient: HttpClient) { }

  getItems(): Observable<DemoItem[]> {
    return this.httpClient.get<DemoItem[]>(`${environment.api}demos`);
  }

  addItem(item: DemoItem): Observable<DemoItem> {
    return this.httpClient.post<DemoItem>(`${environment.api}demos`, item);
  }

  updateItem(item: DemoItem): Observable<DemoItem> {
    return this.httpClient.put<DemoItem>(
      `${environment.api}demos/${item.id}`,
      item
    );
  }

  deleteItem(id: number): Observable<any> {
    return this.httpClient.delete(`${environment.api}demos/${id}`);
  }
}
