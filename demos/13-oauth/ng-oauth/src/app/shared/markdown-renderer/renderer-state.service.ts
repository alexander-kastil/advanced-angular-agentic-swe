import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RendererStateService {
  private _visible = signal(true);
  visible = this._visible.asReadonly();

  toggleVisibility() {
    this._visible.update(v => !v);
  }
}
