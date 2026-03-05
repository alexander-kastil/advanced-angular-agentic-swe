import { Component, output, input } from '@angular/core';
import { CommentItem } from '../../comment.model';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-comments-list',
    templateUrl: './comments-list.component.html',
    styleUrls: ['./comments-list.component.scss'],
    imports: [MatButton]
})
export class CommentsListComponent {
  readonly Comments = input<CommentItem[] | null>(null);
  readonly onCommentEdit = output<CommentItem>();
  readonly onCommentDelete = output<CommentItem>();

  editComment(item: CommentItem) {
    this.onCommentEdit.emit(item);
  }

  deleteComment(item: CommentItem) {
    this.onCommentDelete.emit(item);
  }
}
