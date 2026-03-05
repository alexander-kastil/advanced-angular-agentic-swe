import { Injectable, OnDestroy } from '@angular/core';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { CommentItem } from '../comment.model';
import { MarkdownEditorActions } from './editor.actions';
import { EditorState } from './editor.reducer';
import { getComments, hasLoaded } from './editor.selectors';

@Injectable({
  providedIn: 'root',
})
export class EditorFacade implements OnDestroy {
  subs = new Subscription();
  private callCompletedSub = new Subject<boolean>();
  callCompleted$ = this.callCompletedSub.asObservable();

  constructor(
    private store: Store<EditorState>,
    private actions: ActionsSubject
  ) {
    //Could be used to respond to effects completion to trigger an action in the UI
    //As an alternative you could also hook into the loading indicator
    this.subs = this.actions
      .pipe(
        ofType(
          MarkdownEditorActions.saveCommentsSuccess,
          MarkdownEditorActions.saveCommentsFailure,
          MarkdownEditorActions.deleteCommentsSuccess,
          MarkdownEditorActions.deleteCommentsFailure
        )
      )
      .subscribe((data) => {
        console.log('action complete', data);
        this.callCompletedSub.next(true);
      });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  init() {
    this.store.dispatch(MarkdownEditorActions.loadComments());
  }

  hasLoaded() {
    return this.store.select(hasLoaded).pipe(take(1));
  }

  getComments() {
    return this.store.select(getComments);
  }

  saveComment(item: CommentItem) {
    this.store.dispatch(MarkdownEditorActions.saveComments({ item }));
  }

  deleteComment(item: CommentItem) {
    this.store.dispatch(MarkdownEditorActions.deleteComments({ item }));
  }
}
