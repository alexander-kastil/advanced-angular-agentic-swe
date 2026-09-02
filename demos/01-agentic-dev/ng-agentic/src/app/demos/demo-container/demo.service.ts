import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemoItem } from './demo-item.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DemoService {
    private http = inject(HttpClient);

    getDemos(): Observable<DemoItem[]> {
        return this.http.get<DemoItem[]>(`${environment.api}demos`);
    }

    addDemo(item: DemoItem): Observable<DemoItem> {
        return this.http.post<DemoItem>(`${environment.api}demos`, item);
    }

    updateDemo(item: DemoItem): Observable<DemoItem> {
        return this.http.put<DemoItem>(`${environment.api}demos/${item.id}`, item);
    }

    deleteDemo(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.api}demos/${id}`);
    }
}
