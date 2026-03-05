import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidePanelService {
  private _editorVisible = signal(false);
  private _rendererVisible = signal(true);

  editorVisible = this._editorVisible.asReadonly();
  rendererVisible = this._rendererVisible.asReadonly();

  toggleEditor() {
    this._editorVisible.update(v => !v);
  }

  toggleRenderer() {
    this._rendererVisible.update(v => !v);
  }
}
