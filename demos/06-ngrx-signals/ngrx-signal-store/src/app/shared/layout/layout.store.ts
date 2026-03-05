import { computed, effect } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { getState, patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';

export type MarkdownMode = 'guide' | 'editor';

type LayoutState = {
    markdownPaneVisible: boolean;
    markdownMode: MarkdownMode;
    sidenavVisible: boolean;
    sidenavPosition: MatDrawerMode;
    demoPaneSize: number;
    hasMarkdownContent: boolean;
};

const defaults: LayoutState = {
    markdownPaneVisible: false,
    markdownMode: 'guide',
    sidenavVisible: true,
    sidenavPosition: 'side',
    demoPaneSize: 500,
    hasMarkdownContent: false,
};

type PersistedState = Omit<LayoutState, 'hasMarkdownContent'>;

const STORAGE_KEY = 'layout-state';

function loadFromStorage(): Partial<PersistedState> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export const LayoutStore = signalStore(
    { providedIn: 'root', protectedState: false },
    withState(defaults),
    withComputed(({ markdownPaneVisible, markdownMode, hasMarkdownContent }) => ({
        isGuideActive: computed(() => markdownPaneVisible() && markdownMode() === 'guide'),
        isEditorActive: computed(() => markdownPaneVisible() && markdownMode() === 'editor'),
        showMarkdownPane: computed(() => markdownPaneVisible() && hasMarkdownContent()),
    })),
    withMethods((store) => ({
        showGuide() {
            if (store.isGuideActive()) {
                patchState(store, { markdownPaneVisible: false });
            } else {
                patchState(store, { markdownPaneVisible: true, markdownMode: 'guide' });
            }
        },
        showEditor() {
            patchState(store, { markdownMode: 'editor' });
        },
        toggleEditor() {
            if (store.markdownMode() === 'editor') {
                patchState(store, { markdownMode: 'guide' });
            } else {
                patchState(store, { markdownPaneVisible: true, markdownMode: 'editor' });
            }
        },
        toggleSidenavVisible() {
            patchState(store, { sidenavVisible: !store.sidenavVisible() });
        },
        setSidenavVisible(visible: boolean) {
            patchState(store, { sidenavVisible: visible });
        },
        setSidenavPosition(position: MatDrawerMode) {
            patchState(store, { sidenavPosition: position });
        },
        setDemoPaneSize(size: number) {
            patchState(store, { demoPaneSize: size });
        },
        setHasMarkdownContent(value: boolean) {
            patchState(store, { hasMarkdownContent: value });
        },
        resetToGuide() {
            patchState(store, { markdownPaneVisible: true, markdownMode: 'guide' });
        },
    })),
    withHooks({
        onInit(store) {
            const saved = loadFromStorage();
            if (Object.keys(saved).length > 0) {
                patchState(store, saved);
            }
            effect(() => {
                const { hasMarkdownContent, ...persisted } = getState(store);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
            });
        },
    }),
);
