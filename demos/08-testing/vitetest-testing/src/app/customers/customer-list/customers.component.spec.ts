import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Customer } from '../customer.model';
import { customersStore } from '../customers.store';
import { CustomersComponent } from './customers.component';

describe('Component - Spy - CustomersComponent', () => {
  let fixture: ComponentFixture<CustomersComponent>;
  let component: CustomersComponent;

  const mockCustomers: Customer[] = [
    { id: 1, name: 'Soi' },
    { id: 2, name: 'Giro' },
  ];

  const storeSpy = {
    customers: signal(mockCustomers),
    loading: signal(false),
    selectedCustomer: signal<Customer | null>(null),
    count: signal(2),
    nextId: signal(3),
    fetchCustomers: vi.fn(),
    selectCustomer: vi.fn(),
    addCustomer: vi.fn(),
    updateCustomer: vi.fn(),
    deleteCustomer: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersComponent, NoopAnimationsModule],
      providers: [
        { provide: customersStore, useValue: storeSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call selectCustomer when onEdit is called', () => {
    const customer = mockCustomers[0];
    component.onEdit(customer);
    expect(storeSpy.selectCustomer).toHaveBeenCalledWith(customer);
  });

  it('should call deleteCustomer when onDelete is called', () => {
    component.onDelete(1);
    expect(storeSpy.deleteCustomer).toHaveBeenCalledWith(1);
  });

  it('should call selectCustomer with null when onCancel is called', () => {
    component.onCancel();
    expect(storeSpy.selectCustomer).toHaveBeenCalledWith(null);
  });

  it('should call addCustomer when onSave is called for a new customer (id=0)', () => {
    const newCustomer: Customer = { id: 0, name: 'NewCustomer' };
    component.onSave(newCustomer);
    expect(storeSpy.addCustomer).toHaveBeenCalledWith(newCustomer);
  });

  it('should call updateCustomer when onSave is called for an existing customer', () => {
    const existing: Customer = { id: 1, name: 'Updated Soi' };
    component.onSave(existing);
    expect(storeSpy.updateCustomer).toHaveBeenCalledWith(existing);
  });

  it('should create a new customer with nextId when onAdd is called', () => {
    component.onAdd();
    expect(storeSpy.selectCustomer).toHaveBeenCalledWith({ id: 3, name: '' });
  });
});
