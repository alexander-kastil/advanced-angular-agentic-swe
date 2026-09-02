import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { HooksAndGatesComponent } from './hooks-and-gates.component';

describe('HooksAndGatesComponent', () => {
  it('blocks a write that contains a banned API', () => {
    const component = TestBed.createComponent(HooksAndGatesComponent).componentInstance;

    component.setDraft('@Component({ standalone: true })');

    expect(component.exitCode()).toBe(2);
    expect(component.hookOutput()).toContain('standalone: true');
  });

  it('allows a clean write', () => {
    const component = TestBed.createComponent(HooksAndGatesComponent).componentInstance;

    component.setDraft('readonly name = input.required<string>();');

    expect(component.exitCode()).toBe(0);
  });

  it('stops gating once the hook is disabled', () => {
    const component = TestBed.createComponent(HooksAndGatesComponent).componentInstance;

    component.setDraft('@Input() name = "";');
    component.toggle();

    expect(component.exitCode()).toBe(0);
    expect(component.hookOutput()).toContain('Hook disabled');
  });
});
