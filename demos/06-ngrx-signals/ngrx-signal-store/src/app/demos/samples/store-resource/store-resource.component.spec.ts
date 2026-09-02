import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Signal, WritableSignal } from '@angular/core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../../environments/environment';
import { Topic } from '../../../topics/topic.model';
import { StoreResourceComponent } from './store-resource.component';

const topics: Topic[] = [
  { id: 1, name: 'Angular', completed: true },
  { id: 3, name: 'Signals', completed: false },
];

describe('StoreResourceComponent (resource extensions)', () => {
  let fixture: ComponentFixture<StoreResourceComponent>;
  let http: HttpTestingController;

  const search = () => fixture.componentInstance['search'] as WritableSignal<string>;
  const resource = () => fixture.componentInstance['topics'];
  const errorMessage = () => (fixture.componentInstance['errorMessage'] as Signal<string>)();
  const text = () => (fixture.nativeElement as HTMLElement).innerText ?? fixture.nativeElement.textContent;
  const rowCount = () => (fixture.nativeElement as HTMLElement).querySelectorAll('.row').length;
  const settle = async () => {
    TestBed.tick();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    TestBed.tick();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreResourceComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreResourceComponent);
    fixture.detectChanges();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('loads the unfiltered topics url and renders every row', async () => {
    http.expectOne(`${environment.api}topics`).flush(topics);
    await settle();

    expect(resource().status()).toBe('resolved');
    expect(rowCount()).toBe(2);
    expect(text()).toContain('#1 Angular');
    expect(text()).toContain('#3 Signals');
  });

  it('encodes the search term into the request url', async () => {
    http.expectOne(`${environment.api}topics`).flush(topics);
    await settle();

    search().set('Copilot Dev');
    await settle();

    http.expectOne(`${environment.api}topics?name_like=Copilot%20Dev`).flush([topics[0]]);
    await settle();

    expect(rowCount()).toBe(1);
    expect(text()).toContain('#1 Angular');
  });

  it('keeps the previous value on screen while the next request is loading', async () => {
    http.expectOne(`${environment.api}topics`).flush(topics);
    await settle();

    search().set('Sig');
    await settle();
    const pending = http.expectOne(`${environment.api}topics?name_like=Sig`);
    await settle();

    expect(resource().isLoading()).toBe(true);
    expect(resource().value()).toEqual(topics);
    expect(text()).toContain('#1 Angular');

    pending.flush([topics[1]]);
    await settle();

    expect(resource().isLoading()).toBe(false);
    expect(resource().value()).toEqual([topics[1]]);
    expect(rowCount()).toBe(1);
  });

  it('falls back to the configured value instead of throwing when the request errors', async () => {
    http.expectOne(`${environment.api}topics`).flush(topics);
    await settle();

    search().set('boom');
    await settle();
    http
      .expectOne(`${environment.api}topics?name_like=boom`)
      .flush('nope', { status: 500, statusText: 'Server Error' });
    await settle();

    expect(resource().status()).toBe('error');
    expect(resource().value()).toEqual([]);
    expect(errorMessage()).not.toBe('');
    expect(rowCount()).toBe(0);
    expect(text()).toContain('No topics.');
  });

  it('reloads the current url on demand', async () => {
    http.expectOne(`${environment.api}topics`).flush(topics);
    await settle();

    resource().reload();
    await settle();

    http.expectOne(`${environment.api}topics`).flush([topics[0]]);
    await settle();

    expect(rowCount()).toBe(1);
    expect(text()).toContain('#1 Angular');
  });
});
