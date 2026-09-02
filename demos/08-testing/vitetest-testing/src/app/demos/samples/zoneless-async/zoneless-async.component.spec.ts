import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ZonelessAsyncComponent } from './zoneless-async.component';

function text(fixture: ComponentFixture<unknown>, testId: string): string {
  return fixture.nativeElement.querySelector(`[data-testid="${testId}"]`).textContent.trim();
}

describe('Zoneless Async - ZonelessAsyncComponent', () => {
  let fixture: ComponentFixture<ZonelessAsyncComponent>;
  let component: ZonelessAsyncComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZonelessAsyncComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ZonelessAsyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.stopTicking();
    vi.useRealTimers();
  });

  it('renders the idle status before anything runs', () => {
    expect(text(fixture, 'status')).toBe('status: idle');
    expect(fixture.nativeElement.querySelectorAll('[data-testid="row"]').length).toBe(0);
  });

  it('waits for the awaited work with whenStable', async () => {
    component.load();

    await fixture.whenStable();

    expect(component.status()).toBe('loaded');
    expect(component.rows().length).toBe(3);
  });

  it('has rendered the loaded rows once whenStable resolves', async () => {
    component.load();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('[data-testid="row"]').length).toBe(3);
    expect(text(fixture, 'status')).toBe('status: loaded');
  });

  it('renders a signal change with TestBed.tick and no detectChanges call', () => {
    component.reset();
    component.rows.set(['written directly']);

    TestBed.tick();

    expect(text(fixture, 'row')).toBe('written directly');
  });

  it('flushes effects with TestBed.tick', () => {
    component.status.set('loading');
    component.status.set('loaded');

    TestBed.tick();

    expect(component.history()).toEqual(['idle', 'loaded']);
  });

  it('drives the interval with fake timers instead of waiting a real second', () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    component.startTicking();

    vi.advanceTimersByTime(3000);
    TestBed.tick();

    expect(component.ticks()).toBe(3);
    expect(text(fixture, 'ticks')).toBe('3 ticks');
  });

  it('stops the interval when the component stops ticking', () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    component.startTicking();
    vi.advanceTimersByTime(2000);
    component.stopTicking();

    vi.advanceTimersByTime(5000);
    TestBed.tick();

    expect(component.ticks()).toBe(2);
  });

  it('reaches the same fixture through TestBed.getLastFixture', () => {
    const last = TestBed.getLastFixture<ZonelessAsyncComponent>();

    expect(last).toBe(fixture);
    expect(last.componentInstance.status()).toBe('idle');
  });

  it('lets a helper create the fixture and the test find it again', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ZonelessAsyncComponent, NoopAnimationsModule],
    }).compileComponents();
    TestBed.createComponent(ZonelessAsyncComponent).detectChanges();

    const created = TestBed.getLastFixture<ZonelessAsyncComponent>();
    created.componentInstance.load();
    await created.whenStable();

    expect(created.componentInstance.rows()).toEqual(['Vitest', 'TestBed.tick', 'whenStable']);
  });
});
