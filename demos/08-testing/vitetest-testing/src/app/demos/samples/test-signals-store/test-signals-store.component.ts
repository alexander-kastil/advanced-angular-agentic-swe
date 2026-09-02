import { Component, inject } from '@angular/core';
import { Dispatcher } from '@ngrx/signals/events';
import { mdEditorEvents } from '../../../shared/markdown-editor/markdown-editor.events';
import { markdownEditorStore } from '../../../shared/markdown-editor/markdown-editor.store';

@Component({
  selector: 'app-test-signals-store',
  template: `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">markdownEditorStore</h2>
      </div>
      <div class="card-content">
        <p>
          The store reacts to events. The spec dispatches the same events through the
          <b>Dispatcher</b> and asserts the resulting state.
        </p>
        <button type="button" class="btn btn-primary self-start" (click)="fetch()">
          Dispatch fetch
        </button>

        <div data-testid="loading">isLoading: {{ store.isLoading() }}</div>
        <div data-testid="error">error: {{ store.error() ?? 'none' }}</div>
        <div data-testid="count">entities: {{ store.entities().length }}</div>

        @for (item of store.comments(); track item.id) {
          <div data-testid="entity-row">{{ item.id }} - {{ item.title }}</div>
        }
      </div>
    </div>
  `,
})
export class TestSignalsStoreComponent {
  readonly store = inject(markdownEditorStore);
  private dispatcher = inject(Dispatcher);

  fetch() {
    this.dispatcher.dispatch(mdEditorEvents.fetch());
  }
}
