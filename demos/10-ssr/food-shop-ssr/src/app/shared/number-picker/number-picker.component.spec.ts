import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { NumberPickerComponent } from './number-picker.component';

describe('NumberPickerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [NumberPickerComponent] }).compileComponents();
  });

  it('starts at the initial value and never drops below zero', () => {
    const fixture = TestBed.createComponent(NumberPickerComponent);
    fixture.componentRef.setInput('initialValue', 1);
    fixture.detectChanges();

    const picker = fixture.componentInstance;
    expect(picker.quantity()).toBe(1);

    picker.onRemove();
    picker.onRemove();
    expect(picker.quantity()).toBe(0);

    picker.onAdd();
    expect(picker.quantity()).toBe(1);
  });
});
