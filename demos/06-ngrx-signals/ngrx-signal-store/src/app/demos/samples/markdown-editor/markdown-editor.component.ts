import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { injectDispatch } from '@ngrx/signals/events';
import { mdEditorEvents } from '../../../shared/markdown-editor/markdown-editor.events';
import { markdownEditorStore } from '../../../shared/markdown-editor/markdown-editor.store';
import { createMarkdownItem, MarkdownItem } from '../../../shared/markdown-editor/markdown.model';

@Component({
  selector: 'app-markdown-editor',
  imports: [FormsModule, ProgressBarComponent],
  templateUrl: './markdown-editor.component.html',
  styleUrl: './markdown-editor.component.scss',
})
export class MarkdownEditorComponent {
  protected store = inject(markdownEditorStore);
  protected dispatch = injectDispatch(mdEditorEvents);
  protected draft = signal<MarkdownItem>(createMarkdownItem());

  edit(item: MarkdownItem) {
    this.draft.set({ ...item });
  }

  patch(changes: Partial<MarkdownItem>) {
    this.draft.set({ ...this.draft(), ...changes });
  }

  save() {
    const item = this.draft();
    if (!item.title.trim()) return;
    this.dispatch.save(item);
    this.draft.set(createMarkdownItem());
  }

  remove(item: MarkdownItem) {
    this.dispatch.delete(item);
  }
}
