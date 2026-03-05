import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Customer } from '../customer.model';
import { CustomerEditComponent } from './customer-edit.component';

describe('Component - Input Signals & Outputs - CustomerEditComponent', () => {
  let fixture: ComponentFixture<CustomerEditComponent>;
  let component: CustomerEditComponent;

  const customer: Customer = { id: 2, name: 'Giro' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerEditComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerEditComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('customer', customer);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the customer id from input signal', () => {
    const idInput: HTMLInputElement = fixture.nativeElement.querySelector('input[readonly]');
    expect(idInput.value).toBe('2');
  });

  it('should display the customer name from input signal', () => {
    const nameInput: HTMLInputElement = fixture.nativeElement.querySelectorAll('input')[1];
    expect(nameInput.value).toBe('Giro');
  });

  it('should update local model when input signal changes', () => {
    fixture.componentRef.setInput('customer', { id: 5, name: 'Flora' });
    fixture.detectChanges();

    const idInput: HTMLInputElement = fixture.nativeElement.querySelector('input[readonly]');
    expect(idInput.value).toBe('5');
  });

  it('should emit save output with updated customer on form submit', () => {
    const saveSpy = vi.fn();
    component.save.subscribe(saveSpy);

    const nameInput: HTMLInputElement = fixture.nativeElement.querySelectorAll('input')[1];
    nameInput.value = 'Giro Updated';
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', new Event('submit'));
    fixture.detectChanges();

    expect(saveSpy).toHaveBeenCalledWith({ id: 2, name: 'Giro Updated' });
  });

  it('should emit cancel output when Cancel is clicked', () => {
    const cancelSpy = vi.fn();
    component.cancel.subscribe(cancelSpy);

    const cancelBtn = fixture.debugElement.queryAll(By.css('button'))[1];
    cancelBtn.nativeElement.click();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should disable the Save button when name is empty', () => {
    fixture.componentRef.setInput('customer', { id: 1, name: '' });
    fixture.detectChanges();

    const saveBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type=submit]');
    expect(saveBtn.disabled).toBe(true);
  });

  it('should enable Save button when name is provided', () => {
    const saveBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type=submit]');
    expect(saveBtn.disabled).toBe(false);
  });
});
