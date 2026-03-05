import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RendererStateService {
  private _visible = signal(true);
  visible = this._visible.asReadonly();

  private mermaidLoaded = false;

  toggleVisibility() {
    this._visible.update(v => !v);
  }

  async loadMermaid() {
    if (this.mermaidLoaded) {
      return;
    }
    const mermaid = await import('mermaid');
    mermaid.default.initialize({ startOnLoad: true, theme: 'dark' });
    this.mermaidLoaded = true;
  }
}
