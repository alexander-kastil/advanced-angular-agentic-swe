import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withMethods } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { MarkdownItem } from './markdown.model';

export function withMarkdownItems() {
    return signalStoreFeature(
        withEntities<MarkdownItem>(),
        withComputed((store) => ({
            pageOverrides: computed(() => store.entities().filter(i => i.id === -1)),
            comments: computed(() => store.entities().filter(i => i.id > 0)),
            getPageOverride: computed(() => (url: string) =>
                store.entities().find(i => i.id === -1 && i.url === url) ?? null
            ),
            isPageSaved: computed(() => (url: string) =>
                store.entities().some(i => i.id === -1 && i.url === url)
            ),
        })),
        withMethods((store) => ({
            listItems(url: string, title: string, fallbackMd: string): MarkdownItem[] {
                const items = store.entities();
                if (!title) return items;
                const saved = items.find(i => i.id === -1 && i.url === url);
                if (saved) return [saved, ...items.filter(i => !(i.id === -1 && i.url === url))];
                return [{ id: -1, url, title, comment: fallbackMd, saved: undefined } as MarkdownItem, ...items];
            },
        })),
    );
}
