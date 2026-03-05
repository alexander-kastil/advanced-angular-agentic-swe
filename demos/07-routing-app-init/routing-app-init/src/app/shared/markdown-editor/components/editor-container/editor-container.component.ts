import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MarkdownItem } from '../../markdown.model';
import { MatButton } from '@angular/material/button';
import { MarkdownEditComponent } from '../markdown-edit/markdown-edit.component';
import { MarkdownListComponent } from '../markdown-list/markdown-list.component';
import { ColumnDirective } from '../../../formatting/formatting-directives';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { markdownEditorStore } from '../../markdown-editor.store';

@Component({
  selector: 'app-editor-container',
  templateUrl: './editor-container.component.html',
  styleUrls: ['./editor-container.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    ColumnDirective,
    MarkdownListComponent,
    MarkdownEditComponent,
    MatCardActions,
    MatButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorContainerComponent {
  store = inject(markdownEditorStore);
  editorEdit = signal(false);
  current = signal<MarkdownItem | null>(null);

  addComment() {
    this.current.set(new MarkdownItem());
    this.editorEdit.set(true);
  }

  saveComment() {
    const item = this.current();
    if (item) {
      this.store.saveComment(item);
      this.editorEdit.set(false);
    }
  }

  deleteComment(item: MarkdownItem) {
    this.store.deleteComment(item);
  }

  editComment(item: MarkdownItem) {
    this.current.set({ ...item });
    this.editorEdit.set(true);
  }
}
