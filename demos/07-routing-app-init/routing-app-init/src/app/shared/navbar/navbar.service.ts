import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NavItem } from './navitem.model';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  readonly topItems = httpResource<NavItem[]>(() => `${environment.api}top-links`, {
    defaultValue: [],
  });
}
