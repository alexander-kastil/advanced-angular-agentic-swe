import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { MarkdownItem } from './markdown.model';

export const mdEditorEvents = eventGroup({
    source: 'Markdown Editor',
    events: {
        fetch: type<void>(),
        fetchSuccess: type<MarkdownItem[]>(),
        fetchFailed: type<string>(),
        save: type<MarkdownItem>(),
        saveSuccess: type<MarkdownItem>(),
        saveFailed: type<string>(),
        delete: type<MarkdownItem>(),
        deleteSuccess: type<number>(),
        deleteFailed: type<string>(),
        loadContent: type<string>(),
        loadContentSuccess: type<string>(),
        loadContentFailed: type<string>(),
        addItem: type<void>(),
    },
});
