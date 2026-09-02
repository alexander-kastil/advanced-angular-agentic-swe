import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { environment } from '../../../../environments/environment';
import { ErrorLogService } from './error-log.service';
import { errorMappingInterceptor } from './error-mapping.interceptor';
import { HttpErrorTestsComponent } from './http-error-tests.component';
import { UnstableApiService } from './unstable-api.service';

describe('HTTP Error Tests - interceptor and error paths', () => {
  let controller: HttpTestingController;
  let api: UnstableApiService;
  let errors: ErrorLogService;
  const url = `${environment.api}customers`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorMappingInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    controller = TestBed.inject(HttpTestingController);
    api = TestBed.inject(UnstableApiService);
    errors = TestBed.inject(ErrorLogService);
    errors.clear();
  });

  afterEach(() => {
    controller.verify();
  });

  it('maps a 404 to a sentence a user can read', () => {
    const onError = vi.fn();
    api.loadOne(9999).subscribe({ error: onError });

    controller.expectOne(`${url}/9999`).flush('Not Found', { status: 404, statusText: 'Not Found' });

    expect(onError).toHaveBeenCalledOnce();
    expect(onError.mock.calls[0][0].message).toBe('That record no longer exists');
  });

  it('maps a 409 conflict', () => {
    const onError = vi.fn();
    api.save({ id: 1, name: 'Stale' }).subscribe({ error: onError });

    controller.expectOne(`${url}/1`).flush('Conflict', { status: 409, statusText: 'Conflict' });

    expect(onError.mock.calls[0][0].message).toBe('Someone else changed this record first');
  });

  it('maps every 5xx to the retry message', () => {
    const onError = vi.fn();
    api.load().subscribe({ error: onError });

    controller.expectOne(url).flush('Boom', { status: 503, statusText: 'Service Unavailable' });

    expect(onError.mock.calls[0][0].message).toBe('The server failed, please retry');
  });

  it('maps a transport failure to status 0', () => {
    const onError = vi.fn();
    api.load().subscribe({ error: onError });

    controller.expectOne(url).error(new ProgressEvent('network error'));

    expect(onError.mock.calls[0][0].message).toBe('The server could not be reached');
    expect(errors.log()[0].status).toBe(0);
  });

  it('falls back to the status code for anything unmapped', () => {
    const onError = vi.fn();
    api.load().subscribe({ error: onError });

    controller.expectOne(url).flush('Nope', { status: 418, statusText: 'Teapot' });

    expect(onError.mock.calls[0][0].message).toBe('Unexpected error (418)');
  });

  it('records the failing url and status in the log', () => {
    api.loadOne(7).subscribe({ error: () => undefined });

    controller.expectOne(`${url}/7`).flush('Not Found', { status: 404, statusText: 'Not Found' });

    expect(errors.log()).toEqual([
      { url: `${url}/7`, status: 404, message: 'That record no longer exists' },
    ]);
  });

  it('leaves the log untouched on a successful response', () => {
    const onNext = vi.fn();
    api.load().subscribe({ next: onNext });

    controller.expectOne(url).flush([{ id: 1, name: 'Cleo' }]);

    expect(onNext).toHaveBeenCalledOnce();
    expect(errors.log()).toEqual([]);
  });

  it('replaces the HttpErrorResponse with a plain Error for the caller', () => {
    const onError = vi.fn();
    api.load().subscribe({ error: onError });

    controller.expectOne(url).flush('Boom', { status: 500, statusText: 'Server Error' });

    const received = onError.mock.calls[0][0];
    expect(received).toBeInstanceOf(Error);
    expect(received.status).toBeUndefined();
  });
});

describe('HTTP Error Tests - HttpErrorTestsComponent', () => {
  let fixture: ComponentFixture<HttpErrorTestsComponent>;
  let controller: HttpTestingController;
  const url = `${environment.api}customers`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpErrorTestsComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(withInterceptors([errorMappingInterceptor])),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    controller = TestBed.inject(HttpTestingController);
    TestBed.inject(ErrorLogService).clear();

    fixture = TestBed.createComponent(HttpErrorTestsComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    controller.verify();
  });

  it('shows the empty log before anything fails', () => {
    expect(fixture.nativeElement.querySelector('[data-testid="log-empty"]')).toBeTruthy();
  });

  it('renders the mapped message and the log row after a failed load', () => {
    fixture.nativeElement.querySelector('[data-testid="load"]').click();
    controller.expectOne(url).flush('Boom', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="outcome"]').textContent).toContain(
      'The server failed, please retry'
    );
    expect(fixture.nativeElement.querySelectorAll('[data-testid="log-entry"]').length).toBe(1);
  });

  it('renders the loaded count when the call succeeds', () => {
    fixture.nativeElement.querySelector('[data-testid="load"]').click();
    controller.expectOne(url).flush([{ id: 1, name: 'Cleo' }, { id: 2, name: 'Soi' }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="outcome"]').textContent).toContain(
      'loaded 2 customers'
    );
  });
});

describe('HTTP Error Tests - without the interceptor', () => {
  let fixture: ComponentFixture<HttpErrorTestsComponent>;
  let controller: HttpTestingController;
  const url = `${environment.api}customers`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpErrorTestsComponent, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    controller = TestBed.inject(HttpTestingController);
    TestBed.inject(ErrorLogService).clear();

    fixture = TestBed.createComponent(HttpErrorTestsComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    controller.verify();
  });

  it('maps and records the failure itself when no interceptor is installed', () => {
    fixture.nativeElement.querySelector('[data-testid="missing"]').click();
    controller
      .expectOne(`${url}/9999`)
      .flush('Not Found', { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="outcome"]').textContent).toContain(
      'That record no longer exists'
    );
    expect(TestBed.inject(ErrorLogService).log().length).toBe(1);
  });

  it('logs exactly once, never twice', () => {
    fixture.nativeElement.querySelector('[data-testid="load"]').click();
    controller.expectOne(url).flush('Boom', { status: 500, statusText: 'Server Error' });

    expect(TestBed.inject(ErrorLogService).log().length).toBe(1);
  });
});
