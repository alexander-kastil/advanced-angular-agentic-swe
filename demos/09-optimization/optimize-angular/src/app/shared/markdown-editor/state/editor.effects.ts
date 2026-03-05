import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CommentService } from '../comment.service';
import { MarkdownEditorActions } from './editor.actions';

@Injectable()
export class EditorEffects {
  actions$ = inject(Actions);
  service = inject(CommentService);

  loadComments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarkdownEditorActions.loadComments),
      mergeMap(() =>
        this.service.getComments().pipe(
          map((comments) =>
            MarkdownEditorActions.loadCommentsSuccess({ items: comments })
          ),
          catchError((err) =>
            of(MarkdownEditorActions.loadCommentsFailure({ err }))
          )
        )
      )
    )
  );

  saveComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarkdownEditorActions.saveComments),
      mergeMap((action) =>
        this.service.saveComment(action.item).pipe(
          map((comment) =>
            MarkdownEditorActions.saveCommentsSuccess({ item: comment })
          ),
          catchError((err) =>
            of(MarkdownEditorActions.saveCommentsFailure({ err }))
          )
        )
      )
    )
  );

  deleteComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarkdownEditorActions.deleteComments),
      mergeMap((action) =>
        this.service.deleteComment(action.item).pipe(
          map(() =>
            MarkdownEditorActions.deleteCommentsSuccess({ item: action.item })
          ),
          catchError((err) =>
            of(MarkdownEditorActions.deleteCommentsFailure({ err }))
          )
        )
      )
    )
  );
}
