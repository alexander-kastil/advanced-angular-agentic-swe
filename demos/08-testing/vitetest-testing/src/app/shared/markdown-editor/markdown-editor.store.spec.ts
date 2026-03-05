import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Dispatcher } from '@ngrx/signals/events';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { of, Subject } from 'rxjs';
import { MarkdownEditorService } from './markdown-editor.service';
import { markdownEditorStore } from './markdown-editor.store';
import { mdEditorEvents } from './markdown-editor.events';
import { MarkdownItem } from './markdown.model';

const mockItems: MarkdownItem[] = [
  { id: 1, url: 'intro', title: 'Intro', comment: '# Intro', saved: new Date() },
  { id: 2, url: 'angular', title: 'Angular', comment: '# Angular', saved: new Date() },
];

describe('Signal Store - markdownEditorStore', () => {
  let store: InstanceType<typeof markdownEditorStore>;
  let dispatcher: Dispatcher;
  let serviceSpy: { getMarkdownItems: ReturnType<typeof vi.fn>; saveMarkdownItem: ReturnType<typeof vi.fn>; deleteMarkdownItem: ReturnType<typeof vi.fn>; getMarkdownContent: ReturnType<typeof vi.fn> };
  let controller: HttpTestingController;

  beforeEach(() => {
    serviceSpy = {
      getMarkdownItems: vi.fn().mockReturnValue(of(mockItems)),
      saveMarkdownItem: vi.fn().mockReturnValue(of(mockItems[0])),
      deleteMarkdownItem: vi.fn().mockReturnValue(of(true)),
      getMarkdownContent: vi.fn().mockReturnValue(of('# Content')),
    };

    TestBed.configureTestingModule({
      providers: [
        markdownEditorStore,
        { provide: MarkdownEditorService, useValue: serviceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    store = TestBed.inject(markdownEditorStore);
    dispatcher = TestBed.inject(Dispatcher);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should load items on init via fetch event', () => {
    TestBed.flushEffects();

    expect(serviceSpy.getMarkdownItems).toHaveBeenCalled();
    expect(store.entities().length).toBe(2);
    expect(store.isLoading()).toBe(false);
  });

  it('should set isLoading to true when fetch event is dispatched', () => {
    TestBed.flushEffects(); // complete init with of(mockItems) — isLoading is now false

    const subject = new Subject<MarkdownItem[]>();
    serviceSpy.getMarkdownItems.mockReturnValue(subject.asObservable());

    dispatcher.dispatch(mdEditorEvents.fetch()); // reducer sets isLoading=true, effect waits on subject
    expect(store.isLoading()).toBe(true);

    subject.next(mockItems);
    subject.complete();
    expect(store.isLoading()).toBe(false);
  });

  it('should add items to the entity collection after fetchSuccess', () => {
    TestBed.flushEffects();

    dispatcher.dispatch(mdEditorEvents.fetchSuccess(mockItems));

    expect(store.entities().length).toBe(2);
    expect(store.comments().length).toBe(2);
  });

  it('should update an existing entity on saveSuccess', () => {
    TestBed.flushEffects();

    const updated: MarkdownItem = { id: 1, url: 'intro', title: 'Updated Intro', comment: '# Updated', saved: new Date() };
    dispatcher.dispatch(mdEditorEvents.saveSuccess(updated));

    const item = store.entities().find(i => i.id === 1);
    expect(item?.title).toBe('Updated Intro');
    expect(store.isLoading()).toBe(false);
  });

  it('should remove entity from collection on deleteSuccess', () => {
    TestBed.flushEffects();

    dispatcher.dispatch(mdEditorEvents.deleteSuccess(1));

    expect(store.entities().length).toBe(1);
    expect(store.entities().find(i => i.id === 1)).toBeUndefined();
  });

  it('should set error state on fetchFailed', () => {
    dispatcher.dispatch(mdEditorEvents.fetchFailed('Network error'));

    expect(store.error()).toBe('Network error');
    expect(store.isLoading()).toBe(false);
  });

  it('should set markdownContent on loadContentSuccess', () => {
    dispatcher.dispatch(mdEditorEvents.loadContentSuccess('# Hello World'));

    expect(store.markdownContent()).toBe('# Hello World');
  });

  it('should clear markdownContent when loadContent is dispatched', () => {
    // Use a Subject so getMarkdownContent never emits — markdownContent stays null after reducer runs
    const subject = new Subject<string>();
    serviceSpy.getMarkdownContent.mockReturnValue(subject.asObservable());

    TestBed.flushEffects(); // complete onInit fetch

    dispatcher.dispatch(mdEditorEvents.loadContentSuccess('# Previous'));
    expect(store.markdownContent()).toBe('# Previous');

    // loadContent: reducer sets markdownContent=null, effect subscribes to subject (no emission)
    dispatcher.dispatch(mdEditorEvents.loadContent('some-file'));
    TestBed.flushEffects();
    expect(store.markdownContent()).toBeNull();

    subject.complete();
  });
});
