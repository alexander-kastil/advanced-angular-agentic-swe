import { Component, computed, inject, input, signal } from '@angular/core';
import { createMarkdownItem, MarkdownItem } from '../../markdown.model';
import { MarkdownEditComponent } from '../markdown-edit/markdown-edit.component';
import { MarkdownListComponent } from '../markdown-list/markdown-list.component';
import { ColumnDirective } from '../../../formatting/formatting-directives';
import { markdownEditorStore } from '../../markdown-editor.store';
import { mdEditorEvents } from '../../markdown-editor.events';
import { injectDispatch, Events } from '@ngrx/signals/events';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-markdown-editor-container',
    templateUrl: './markdown-editor-container.component.html',
    styleUrls: ['./markdown-editor-container.component.scss'],
    imports: [
        ColumnDirective,
        MarkdownListComponent,
        MarkdownEditComponent,
    ],
})
export class MarkdownEditorContainerComponent {
    protected store = inject(markdownEditorStore);
    private dispatch = injectDispatch(mdEditorEvents);
    readonly demoTitle = input('');
    readonly demoMd = input('');
    readonly demoUrl = input('');

    editorEdit = signal(false);
    view = signal<'source' | 'preview'>('source');
    current = signal<MarkdownItem | null>(null);

    get currentItem(): MarkdownItem { return this.current()!; }
    set currentItem(value: MarkdownItem) { this.current.set(value); }

    allItems = computed(() => this.store.listItems(this.demoUrl(), this.demoTitle(), this.demoMd()));
    isDemoSaved = computed(() => this.store.isPageSaved()(this.demoUrl()));

    constructor() {
        inject(Events).on(mdEditorEvents.addItem)
            .pipe(takeUntilDestroyed())
            .subscribe(() => this.addMarkdownItem());
    }

    addMarkdownItem() {
        this.current.set(createMarkdownItem());
        this.view.set('source');
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
        this.view.set('source');
        this.editorEdit.set(true);
    }
}
