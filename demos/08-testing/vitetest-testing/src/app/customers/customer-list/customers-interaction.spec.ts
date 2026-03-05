import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Customer } from '../customer.model';
import { customersStore } from '../customers.store';
import { CustomersComponent } from './customers.component';
import { CustomersTableComponent } from '../customers-table/customers-table.component';

describe('Component - Interaction - CustomersComponent', () => {
  let fixture: ComponentFixture<CustomersComponent>;
  let component: CustomersComponent;

  const mockCustomers: Customer[] = [
    { id: 1, name: 'Soi' },
    { id: 2, name: 'Giro' },
  ];

  const selectedCustomer = signal<Customer | null>(null);

  const storeSpy = {
    customers: signal(mockCustomers),
    loading: signal(false),
    selectedCustomer,
    count: signal(2),
    nextId: signal(3),
    fetchCustomers: vi.fn(),
    selectCustomer: vi.fn().mockImplementation((c: Customer | null) => selectedCustomer.set(c)),
    addCustomer: vi.fn(),
    updateCustomer: vi.fn(),
    deleteCustomer: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    selectedCustomer.set(null);

    await TestBed.configureTestingModule({
      imports: [CustomersComponent, NoopAnimationsModule],
      providers: [{ provide: customersStore, useValue: storeSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show the table and no edit form initially', () => {
    const table = fixture.debugElement.query(By.directive(CustomersTableComponent));
    expect(table).toBeTruthy();

    const editForm = fixture.debugElement.query(By.css('app-customer-edit'));
    expect(editForm).toBeNull();
  });

  it('should show edit form when a customer is selected', () => {
    selectedCustomer.set(mockCustomers[0]);
    fixture.detectChanges();

    const editForm = fixture.debugElement.query(By.css('app-customer-edit'));
    expect(editForm).toBeTruthy();
  });

  it('should call selectCustomer when edit is triggered from table', () => {
    const table = fixture.debugElement.query(By.directive(CustomersTableComponent));
    table.componentInstance.edit.emit(mockCustomers[0]);

    expect(storeSpy.selectCustomer).toHaveBeenCalledWith(mockCustomers[0]);
  });

  it('should call deleteCustomer when delete is triggered from table', () => {
    const table = fixture.debugElement.query(By.directive(CustomersTableComponent));
    table.componentInstance.delete.emit(1);

    expect(storeSpy.deleteCustomer).toHaveBeenCalledWith(1);
  });

  it('should open new customer form when add is triggered from table', () => {
    const table = fixture.debugElement.query(By.directive(CustomersTableComponent));
    table.componentInstance.add.emit();

    expect(storeSpy.selectCustomer).toHaveBeenCalledWith({ id: 3, name: '' });
  });

  it('should hide edit form and call selectCustomer(null) on cancel', () => {
    selectedCustomer.set(mockCustomers[0]);
    fixture.detectChanges();

    const editForm = fixture.debugElement.query(By.css('app-customer-edit'));
    editForm.componentInstance.cancel.emit();

    expect(storeSpy.selectCustomer).toHaveBeenCalledWith(null);
  });
});
