import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MarkdownItem } from '../../markdown.model';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-markdown-list',
    templateUrl: './markdown-list.component.html',
    styleUrls: ['./markdown-list.component.scss'],
    imports: [MatButton],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownListComponent {
    readonly Comments = input<MarkdownItem[] | null>(null);
    readonly onCommentEdit = output<MarkdownItem>();
    readonly onCommentDelete = output<MarkdownItem>();

    editComment(item: MarkdownItem) {
        this.onCommentEdit.emit(item);
    }

    deleteComment(item: MarkdownItem) {
        this.onCommentDelete.emit(item);
    }
}
