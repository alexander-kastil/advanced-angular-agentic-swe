import { createFeatureSelector, createSelector } from '@ngrx/store';
import { editorFeatureKey, EditorState } from './editor.reducer';

export const getEditorState =
  createFeatureSelector<EditorState>(editorFeatureKey);

export const getComments = createSelector(
  getEditorState,
  (state: EditorState) => state.comments
);

export const hasLoaded = createSelector(
  getEditorState,
  (state: EditorState) => state.loaded
);
