import { Component, OnInit, inject } from '@angular/core';
import { CommentItem } from '../../comment.model';
import { EditorFacade } from '../../state/editor.facade';
import { AsyncPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { CommentEditComponent } from '../comment-edit/comment-edit.component';
import { CommentsListComponent } from '../comments-list/comments-list.component';
import { ColumnDirective } from '../../../formatting/formatting-directives';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';

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
        CommentsListComponent,
        CommentEditComponent,
        MatCardActions,
        MatButton,
        AsyncPipe,
    ]
})
export class EditorContainerComponent implements OnInit {
  ef = inject(EditorFacade)
  comments = this.ef.getComments();
  editorEdit = false;
  current: CommentItem | null = null;

  ngOnInit() {
    this.ef.hasLoaded().subscribe((hasLoaded) => {
      if (hasLoaded == false) {
        this.ef.init();
      }
    });

    //respond to effect completion and toggle view
    this.ef.callCompleted$.subscribe(() => {
      this.editorEdit = false;
    });
  }

  addComment() {
    this.current = new CommentItem();
    this.editorEdit = true;
  }

  saveComment() {
    if (this.current) {
      this.ef.saveComment(this.current);
    }
  }

  deleteComment(item: CommentItem) {
    this.ef.deleteComment(item);
  }

  editComment(item: CommentItem) {
    this.current = { ...item };
    this.editorEdit = true;
  }
}
