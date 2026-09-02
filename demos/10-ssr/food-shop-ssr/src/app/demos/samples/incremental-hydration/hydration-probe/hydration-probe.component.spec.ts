import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HydrationProbeComponent } from './hydration-probe.component';
import { HydrationLogService } from '../hydration-log.service';

describe('HydrationProbeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HydrationProbeComponent],
    }).compileComponents();
  });

  it('renders its label and blurb from signal inputs', () => {
    const fixture = TestBed.createComponent(HydrationProbeComponent);
    fixture.componentRef.setInput('label', 'on viewport');
    fixture.componentRef.setInput('blurb', 'boots when scrolled into view');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('on viewport');
    expect(fixture.nativeElement.textContent).toContain('boots when scrolled into view');
  });

  it('counts clicks once it is interactive', () => {
    const fixture = TestBed.createComponent(HydrationProbeComponent);
    fixture.componentRef.setInput('label', 'immediate');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    button.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.clicks()).toBe(2);
    expect(button.textContent).toContain('counted 2');
  });

  it('marks a label in the hydration log only once', () => {
    const log = TestBed.inject(HydrationLogService);
    log.mark('never');
    const first = log.hydrated()['never'];
    log.mark('never');

    expect(log.hydrated()['never']).toBe(first);
    expect(typeof first).toBe('number');
  });
});
