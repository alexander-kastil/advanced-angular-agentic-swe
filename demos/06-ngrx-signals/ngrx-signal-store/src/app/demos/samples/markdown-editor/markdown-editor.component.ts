import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { injectDispatch } from '@ngrx/signals/events';
import { mdEditorEvents } from '../../../shared/markdown-editor/markdown-editor.events';
import { markdownEditorStore } from '../../../shared/markdown-editor/markdown-editor.store';
import { createMarkdownItem, MarkdownItem } from '../../../shared/markdown-editor/markdown.model';

@Component({
  selector: 'app-markdown-editor',
  imports: [
    FormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatIconButton,
    MatIcon,
    MatProgressBar,
  ],
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
