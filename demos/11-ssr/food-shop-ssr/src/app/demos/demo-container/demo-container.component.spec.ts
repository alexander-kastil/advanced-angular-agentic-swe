import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';
import { DemoContainerComponent } from './demo-container.component';
import { DemoItem } from './demo-item.model';

const catalog: DemoItem[] = [
  {
    id: 2,
    url: 'node-app-engine',
    title: 'Express 5 & AngularNodeAppEngine',
    teaches: 'server.ts walkthrough',
    sortOrder: 2,
    topic: 'Server Rendering',
    md: 'node-app-engine',
  },
  {
    id: 1,
    url: 'server-routes',
    title: 'Server Routes & Render Modes',
    teaches: 'render mode per route',
    sortOrder: 1,
    topic: 'Server Rendering',
    md: 'server-routes',
  },
  {
    id: 4,
    url: 'transfer-cache',
    title: 'State Transfer Cache',
    teaches: 'do not refetch',
    sortOrder: 4,
    topic: 'Hydration',
    md: 'transfer-cache',
  },
];

describe('DemoContainerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoContainerComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMarkdown(),
      ],
    }).compileComponents();
  });

  it('sorts the catalog by sortOrder and groups it by topic', async () => {
    const fixture = TestBed.createComponent(DemoContainerComponent);
    fixture.detectChanges();

    TestBed.tick();

    const http = TestBed.inject(HttpTestingController);
    http.expectOne('http://localhost:3010/demos').flush(catalog);

    await fixture.whenStable();
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.demos().map((demo) => demo.url)).toEqual([
      'server-routes',
      'node-app-engine',
      'transfer-cache',
    ]);
    expect(component.groups().map((group) => group.topic)).toEqual(['Server Rendering', 'Hydration']);
    http.verify();
  });

  it('resolves the guide of the active demo from the url', async () => {
    const fixture = TestBed.createComponent(DemoContainerComponent);
    fixture.detectChanges();

    TestBed.tick();

    const http = TestBed.inject(HttpTestingController);
    http.expectOne('http://localhost:3010/demos').flush(catalog);

    await fixture.whenStable();

    const component = fixture.componentInstance;
    component.currentUrl.set('/demos/transfer-cache');
    fixture.detectChanges();

    expect(component.header()).toBe('State Transfer Cache');
    expect(component.currentMd()).toBe('transfer-cache');

    http.expectOne('markdown/transfer-cache.md').flush('# guide');
    http.verify();
  });
});
