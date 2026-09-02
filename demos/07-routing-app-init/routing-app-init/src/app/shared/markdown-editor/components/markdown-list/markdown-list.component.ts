import { Component, input, output } from '@angular/core';
import { MarkdownItem } from '../../markdown.model';

@Component({
    selector: 'app-markdown-list',
    templateUrl: './markdown-list.component.html',
    styleUrls: ['./markdown-list.component.scss'],
})
export class MarkdownListComponent {
    readonly items = input<MarkdownItem[] | null>(null);
    readonly demoUrl = input('');
    readonly demoSaved = input(false);
    readonly itemEdit = output<MarkdownItem>();
    readonly itemDelete = output<MarkdownItem>();

    editItem(item: MarkdownItem) {
        this.itemEdit.emit(item);
    }

    deleteMarkdownItem(item: MarkdownItem) {
        this.itemDelete.emit(item);
    }
}
