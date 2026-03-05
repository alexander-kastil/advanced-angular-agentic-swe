import { ChangeDetectionStrategy, Component, effect, inject, model } from '@angular/core';
import { createMarkdownItem, MarkdownItem } from '../../markdown.model';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { ColumnDirective } from '../../../formatting/formatting-directives';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { form, FormField } from '@angular/forms/signals';
import { markdownEditorStore } from '../../markdown-editor.store';
import { mdEditorEvents } from '../../markdown-editor.events';
import { injectDispatch } from '@ngrx/signals/events';

@Component({
    selector: 'app-markdown-edit',
    templateUrl: './markdown-edit.component.html',
    styleUrls: ['./markdown-edit.component.scss'],
    imports: [
        ColumnDirective,
        MatFormField,
        MatLabel,
        MatInput,
        CdkTextareaAutosize,
        FormField,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownEditComponent {
    private store = inject(markdownEditorStore);
    private dispatch = injectDispatch(mdEditorEvents);
    readonly markdownItem = model(createMarkdownItem());
    readonly mdSrc = model<string | null>(null);

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
