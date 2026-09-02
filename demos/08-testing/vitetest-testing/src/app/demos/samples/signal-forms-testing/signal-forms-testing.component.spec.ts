import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { SignalFormsTestingComponent } from './signal-forms-testing.component';
import { SignupService } from './signup.service';

describe('Signal Forms - SignalFormsTestingComponent', () => {
  let fixture: ComponentFixture<SignalFormsTestingComponent>;
  let component: SignalFormsTestingComponent;
  let signups: SignupService;

  function fillValid(email = 'ada@demo.io') {
    component.signupForm.email().value.set(email);
    component.signupForm.password().value.set('supersecret');
    component.signupForm.confirm().value.set('supersecret');
    component.signupForm.age().value.set(42);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalFormsTestingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignalFormsTestingComponent);
    component = fixture.componentInstance;
    signups = TestBed.inject(SignupService);
    fixture.detectChanges();
  });

  it('starts invalid and untouched', () => {
    expect(component.signupForm().valid()).toBe(false);
    expect(component.signupForm().touched()).toBe(false);
  });

  it('reports the required error on the empty email field', () => {
    const messages = component.signupForm.email().errors().map((e) => e.message);
    expect(messages).toContain('Email is required');
  });

  it('replaces the required error with the format error once a value is typed', () => {
    component.signupForm.email().value.set('not-an-email');

    const messages = component.signupForm.email().errors().map((e) => e.message);
    expect(messages).toContain('Enter a valid email');
    expect(messages).not.toContain('Email is required');
  });

  it('writes the field value through to the model signal', () => {
    component.signupForm.email().value.set('ada@demo.io');

    expect(component.model().email).toBe('ada@demo.io');
  });

  it('flags a password shorter than eight characters', () => {
    component.signupForm.password().value.set('short');

    expect(component.signupForm.password().invalid()).toBe(true);
    expect(component.signupForm.password().errors().map((e) => e.message)).toContain(
      'Password needs 8 characters'
    );
  });

  it('validates the repeated password across two fields', () => {
    component.signupForm.password().value.set('supersecret');
    component.signupForm.confirm().value.set('supersecrez');

    expect(component.signupForm.confirm().errors().map((e) => e.message)).toContain(
      'Passwords do not match'
    );

    component.signupForm.confirm().value.set('supersecret');

    expect(component.signupForm.confirm().valid()).toBe(true);
  });

  it('enforces the minimum age', () => {
    component.signupForm.age().value.set(17);
    expect(component.signupForm.age().invalid()).toBe(true);

    component.signupForm.age().value.set(18);
    expect(component.signupForm.age().valid()).toBe(true);
  });

  it('turns valid once every rule is satisfied', () => {
    fillValid();

    expect(component.signupForm().valid()).toBe(true);
  });

  it('renders the error summary in the template', () => {
    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll('[data-testid="error"]');
    expect(errors.length).toBeGreaterThan(0);
  });

  it('does not run the action when the form is invalid', async () => {
    const submitted = await component.register();

    expect(submitted).toBe(false);
    expect(component.invalidAttempts()).toBe(1);
    expect(signups.accepted.length).toBe(0);
  });

  it('marks every field touched on an invalid submit', async () => {
    await component.register();

    expect(component.signupForm().touched()).toBe(true);
    expect(component.signupForm.email().touched()).toBe(true);
  });

  it('runs the action and records the signup when the form is valid', async () => {
    fillValid();

    const submitted = await component.register();

    expect(submitted).toBe(true);
    expect(component.accepted()?.email).toBe('ada@demo.io');
    expect(signups.accepted.length).toBe(1);
  });

  it('binds a server error returned by the action onto the email field', async () => {
    fillValid('taken@demo.io');

    await component.register();

    expect(component.signupForm.email().errors().map((e) => e.message)).toContain(
      'Email already registered'
    );
    expect(component.accepted()).toBeNull();
  });

  it('shows the submitted state in the template after a valid submit', async () => {
    fillValid();
    await component.register();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="accepted"]').textContent).toContain(
      'ada@demo.io'
    );
  });
});
