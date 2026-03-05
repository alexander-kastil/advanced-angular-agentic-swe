import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { NavItem } from './navitem.model';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  service = inject(HttpClient);

  getTopItems(): Observable<NavItem[]> {
    return this.service.get<NavItem[]>(`${environment.api}top-links`);
  }
}
