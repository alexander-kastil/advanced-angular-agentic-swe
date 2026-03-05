import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {}
  private theme: BehaviorSubject<string> = new BehaviorSubject('default');

  toggleTheme() {
    const t = this.theme.getValue() === 'default' ? 'dark' : 'default';
    console.log('curr theme:', t);
    this.theme.next(t);
  }

  getTheme(): Observable<string> {
    return this.theme;
  }
}
