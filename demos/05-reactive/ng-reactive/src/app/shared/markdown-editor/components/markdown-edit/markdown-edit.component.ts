import { Component, computed, effect, inject, input, model } from '@angular/core';
import { createMarkdownItem, MarkdownItem } from '../../markdown.model';
import { form, FormField } from '@angular/forms/signals';
import { markdownEditorStore } from '../../markdown-editor.store';
import { mdEditorEvents } from '../../markdown-editor.events';
import { injectDispatch } from '@ngrx/signals/events';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
    selector: 'app-markdown-edit',
    templateUrl: './markdown-edit.component.html',
    styleUrls: ['./markdown-edit.component.scss'],
    imports: [FormField, MarkdownComponent],
})
export class MarkdownEditComponent {
    private store = inject(markdownEditorStore);
    private dispatch = injectDispatch(mdEditorEvents);
    readonly markdownItem = model(createMarkdownItem());
    readonly mdSrc = model<string | null>(null);
    readonly view = input<'source' | 'preview'>('source');

    readonly charCount = computed(() => this.markdownItem().comment?.length ?? 0);
    readonly lineCount = computed(() => this.markdownItem().comment?.split(/\r?\n/).length ?? 0);

    itemForm = form(this.markdownItem);

    constructor() {
        effect(() => {
            const src = this.mdSrc();
            if (src && !src.includes('\n')) {
                this.dispatch.loadContent(src);
            }
        });

        effect(() => {
            const content = this.store.markdownContent();
            if (content && content !== this.markdownItem().comment) {
                this.markdownItem.update(item => ({ ...item, comment: content }));
            }
        });
    }
}
