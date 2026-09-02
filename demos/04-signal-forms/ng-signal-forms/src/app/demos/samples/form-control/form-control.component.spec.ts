import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMarkdown } from 'ngx-markdown';
import { FormControlComponent } from './form-control.component';

describe('FormControlComponent', () => {
  let component: FormControlComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormControlComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideMarkdown()],
    }).compileComponents();

    component = TestBed.createComponent(FormControlComponent).componentInstance;
  });

  it('starts invalid because name is required', () => {
    expect(component.fields.name().valid()).toBe(false);
    expect(component.fields().valid()).toBe(false);
  });

  it('reports the required error message', () => {
    const messages = component.fields.name().errors().map((e) => e.message);
    expect(messages).toContain('Name is required');
  });

  it('becomes valid once the name passes minLength', () => {
    component.fields.name().value.set('Soi');
    expect(component.fields.name().valid()).toBe(true);
    expect(component.fields().valid()).toBe(true);
  });

  it('writes through to the model signal', () => {
    component.updateName();
    expect(component.model().name).toBe('Soi');
  });

  it('tracks touched state', () => {
    expect(component.fields.name().touched()).toBe(false);
    component.markTouched();
    expect(component.fields.name().touched()).toBe(true);
  });

  it('flags the city field when it exceeds maxLength', () => {
    component.fields.city().value.set('A city name that is far too long');
    expect(component.fields.city().invalid()).toBe(true);
  });
});
