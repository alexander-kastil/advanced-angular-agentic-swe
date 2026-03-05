import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CommentItem } from '../comment.model';

export const MarkdownEditorActions = createActionGroup({
  source: 'MarkdownEditor',
  events: {
    loadComments: emptyProps(),
    loadCommentsSuccess: props<{ items: CommentItem[] }>(),
    loadCommentsFailure: props<{ err: Error }>(),
    saveComments: props<{ item: CommentItem }>(),
    saveCommentsSuccess: props<{ item: CommentItem }>(),
    saveCommentsFailure: props<{ err: Error }>(),
    deleteComments: props<{ item: CommentItem }>(),
    deleteCommentsSuccess: props<{ item: CommentItem }>(),
    deleteCommentsFailure: props<{ err: Error }>(),
  },
});
