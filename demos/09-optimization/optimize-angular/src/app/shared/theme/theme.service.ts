import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private theme = signal('default');
  readonly currentTheme = this.theme.asReadonly();

  toggleTheme() {
    this.theme.update(t => t === 'default' ? 'dark' : 'default');
  }

  getTheme() {
    return this.currentTheme;
  }
}
