import { Component, inject, signal } from '@angular/core';
import { createMarkdownItem, MarkdownItem } from '../../markdown.model';
import { MarkdownEditComponent } from '../markdown-edit/markdown-edit.component';
import { MarkdownListComponent } from '../markdown-list/markdown-list.component';
import { ColumnDirective } from '../../../formatting/formatting-directives';
import { markdownEditorStore } from '../../markdown-editor.store';
import { mdEditorEvents } from '../../markdown-editor.events';
import { injectDispatch } from '@ngrx/signals/events';

@Component({
  selector: 'app-editor-container',
  templateUrl: './editor-container.component.html',
  styleUrls: ['./editor-container.component.scss'],
  imports: [
    ColumnDirective,
    MarkdownListComponent,
    MarkdownEditComponent,
  ],
})
export class EditorContainerComponent {
  protected store = inject(markdownEditorStore);
  private dispatch = injectDispatch(mdEditorEvents);
  editorEdit = signal(false);
  current = signal<MarkdownItem | null>(null);

  get currentItem(): MarkdownItem { return this.current()!; }
  set currentItem(value: MarkdownItem) { this.current.set(value); }

  addMarkdownItem() {
    this.current.set(createMarkdownItem());
    this.editorEdit.set(true);
  }

  saveMarkdownItem() {
    const item = this.current();
    if (item) {
      this.dispatch.save(item);
      this.editorEdit.set(false);
    }
  }

  deleteMarkdownItem(item: MarkdownItem) {
    this.dispatch.delete(item);
  }

  editMarkdownItem(item: MarkdownItem) {
    this.current.set({ ...item });
    this.editorEdit.set(true);
  }
}
