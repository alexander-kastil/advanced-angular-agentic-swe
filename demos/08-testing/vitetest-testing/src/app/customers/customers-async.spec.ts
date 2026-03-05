import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Customer } from './customer.model';
import { customersStore } from './customers.store';
import { CustomersComponent } from './customer-list/customers.component';

describe('Component - Async - CustomersComponent', () => {
  let fixture: ComponentFixture<CustomersComponent>;

  const mockCustomers: Customer[] = [
    { id: 1, name: 'Soi' },
    { id: 2, name: 'Giro' },
  ];

  const loading = signal(true);
  const customers = signal<Customer[]>([]);
  const selectedCustomer = signal<Customer | null>(null);

  const storeSpy = {
    customers,
    loading,
    selectedCustomer,
    count: signal(0),
    nextId: signal(3),
    fetchCustomers: vi.fn(),
    selectCustomer: vi.fn(),
    addCustomer: vi.fn(),
    updateCustomer: vi.fn(),
    deleteCustomer: vi.fn(),
  };

  beforeEach(async () => {
    loading.set(true);
    customers.set([]);
    selectedCustomer.set(null);

    await TestBed.configureTestingModule({
      imports: [CustomersComponent, NoopAnimationsModule],
      providers: [{ provide: customersStore, useValue: storeSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersComponent);
    fixture.detectChanges();
  });

  it('should show progress bar while loading', () => {
    const bar = fixture.debugElement.query(By.css('mat-progress-bar'));
    expect(bar).toBeTruthy();
  });

  it('should hide progress bar when loading completes', () => {
    loading.set(false);
    customers.set(mockCustomers);
    fixture.detectChanges();

    const bar = fixture.debugElement.query(By.css('mat-progress-bar'));
    expect(bar).toBeNull();
  });

  it('should render customer rows after data loads', () => {
    loading.set(false);
    customers.set(mockCustomers);
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('mat-row'));
    expect(rows.length).toBe(2);
  });

  it('should show edit form after customer is selected asynchronously', () => {
    loading.set(false);
    customers.set(mockCustomers);
    fixture.detectChanges();

    selectedCustomer.set(mockCustomers[0]);
    fixture.detectChanges();

    const editForm = fixture.debugElement.query(By.css('app-customer-edit'));
    expect(editForm).toBeTruthy();
  });

  it('should hide edit form after async save completes', () => {
    loading.set(false);
    customers.set(mockCustomers);
    selectedCustomer.set(mockCustomers[0]);
    fixture.detectChanges();

    selectedCustomer.set(null);
    fixture.detectChanges();

    const editForm = fixture.debugElement.query(By.css('app-customer-edit'));
    expect(editForm).toBeNull();
  });
});
