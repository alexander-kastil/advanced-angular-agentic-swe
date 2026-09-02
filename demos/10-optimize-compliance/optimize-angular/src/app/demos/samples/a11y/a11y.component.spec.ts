import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { A11yComponent } from './a11y.component';

describe('A11yComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [A11yComponent] }).compileComponents();
  });

  it('renders the accessibility criteria table', () => {
    const fixture = TestBed.createComponent(A11yComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('European Accessibility Act');
  });

  it('exposes the WCAG 2.2 criteria added over 2.1', () => {
    const fixture = TestBed.createComponent(A11yComponent);
    const ids = fixture.componentInstance.criteria.map(item => item.id);
    expect(ids).toContain('2.4.11');
    expect(ids).toContain('2.5.8');
  });
});
