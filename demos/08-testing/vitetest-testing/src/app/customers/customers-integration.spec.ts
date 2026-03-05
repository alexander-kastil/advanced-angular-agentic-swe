import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Customer } from './customer.model';
import { customersStore } from './customers.store';
import { CustomersComponent } from './customer-list/customers.component';
import { CustomersTableComponent } from './customers-table/customers-table.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';

describe('Component - Container / Presenter - CustomersComponent', () => {
  let fixture: ComponentFixture<CustomersComponent>;
  let component: CustomersComponent;

  const mockCustomers: Customer[] = [
    { id: 1, name: 'Soi' },
    { id: 2, name: 'Giro' },
    { id: 3, name: 'Flora' },
  ];

  const selectedCustomer = signal<Customer | null>(null);

  const storeSpy = {
    customers: signal(mockCustomers),
    loading: signal(false),
    selectedCustomer,
    count: signal(3),
    nextId: signal(4),
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

  it('should render CustomersTableComponent as the presenter', () => {
    const table = fixture.debugElement.query(By.directive(CustomersTableComponent));
    expect(table).toBeTruthy();
  });

  it('should pass customers signal to the table presenter', () => {
    const table = fixture.debugElement.query(By.directive(CustomersTableComponent));
    expect(table.componentInstance.customers()).toEqual(mockCustomers);
  });

  it('should pass loading signal to the table presenter', () => {
    const table = fixture.debugElement.query(By.directive(CustomersTableComponent));
    expect(table.componentInstance.loading()).toBe(false);
  });

  it('should show CustomerEditComponent only when a customer is selected', () => {
    expect(fixture.debugElement.query(By.directive(CustomerEditComponent))).toBeNull();

    selectedCustomer.set(mockCustomers[0]);
    fixture.detectChanges();

    const editComp = fixture.debugElement.query(By.directive(CustomerEditComponent));
    expect(editComp).toBeTruthy();
    expect(editComp.componentInstance.customer()).toEqual(mockCustomers[0]);
  });

  it('should wire table edit output to container onEdit', () => {
    const table = fixture.debugElement.query(By.directive(CustomersTableComponent));
    table.componentInstance.edit.emit(mockCustomers[1]);

    expect(storeSpy.selectCustomer).toHaveBeenCalledWith(mockCustomers[1]);
  });

  it('should wire table delete output to container onDelete', () => {
    const table = fixture.debugElement.query(By.directive(CustomersTableComponent));
    table.componentInstance.delete.emit(2);

    expect(storeSpy.deleteCustomer).toHaveBeenCalledWith(2);
  });

  it('should wire edit save output to container onSave (update path)', () => {
    selectedCustomer.set(mockCustomers[0]);
    fixture.detectChanges();

    const editComp = fixture.debugElement.query(By.directive(CustomerEditComponent));
    editComp.componentInstance.save.emit({ id: 1, name: 'Soi Updated' });

    expect(storeSpy.updateCustomer).toHaveBeenCalledWith({ id: 1, name: 'Soi Updated' });
  });

  it('should wire edit cancel output to container onCancel', () => {
    selectedCustomer.set(mockCustomers[0]);
    fixture.detectChanges();

    const editComp = fixture.debugElement.query(By.directive(CustomerEditComponent));
    editComp.componentInstance.cancel.emit();

    expect(storeSpy.selectCustomer).toHaveBeenCalledWith(null);
    expect(selectedCustomer()).toBeNull();
  });

  it('should wire table add output to create new customer with nextId', () => {
    const table = fixture.debugElement.query(By.directive(CustomersTableComponent));
    table.componentInstance.add.emit();

    expect(storeSpy.selectCustomer).toHaveBeenCalledWith({ id: 4, name: '' });
  });
});
