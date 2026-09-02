import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Dispatcher } from '@ngrx/signals/events';
import { mdEditorEvents } from '../../../shared/markdown-editor/markdown-editor.events';
import { markdownEditorStore } from '../../../shared/markdown-editor/markdown-editor.store';

@Component({
  selector: 'app-test-signals-store',
  imports: [MatCardModule, MatButtonModule],
  template: `
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title>markdownEditorStore</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>
          The store reacts to events. The spec dispatches the same events through the
          <b>Dispatcher</b> and asserts the resulting state.
        </p>
        <button mat-raised-button color="primary" (click)="fetch()">Dispatch fetch</button>

        <div data-testid="loading">isLoading: {{ store.isLoading() }}</div>
        <div data-testid="error">error: {{ store.error() ?? 'none' }}</div>
        <div data-testid="count">entities: {{ store.entities().length }}</div>

        @for (item of store.comments(); track item.id) {
          <div data-testid="entity-row">{{ item.id }} - {{ item.title }}</div>
        }
      </mat-card-content>
    </mat-card>
  `,
})
export class TestSignalsStoreComponent {
  readonly store = inject(markdownEditorStore);
  private dispatcher = inject(Dispatcher);

  fetch() {
    this.dispatcher.dispatch(mdEditorEvents.fetch());
  }
}
