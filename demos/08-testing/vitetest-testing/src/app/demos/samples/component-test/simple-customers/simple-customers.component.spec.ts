import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Customer } from '../../../../customers/customer.model';
import { CustomersService } from '../../../../customers/customers.service';
import { SimpleCustomersComponent } from './simple-customers.component';

const customerData: Customer[] = [
  { id: 1, name: 'Soi' },
  { id: 2, name: 'Giro' },
  { id: 3, name: 'Flora' },
  { id: 4, name: 'Alex' },
];

describe('Component - Resource & Spy - SimpleCustomersComponent', () => {
  let component: SimpleCustomersComponent;
  let fixture: ComponentFixture<SimpleCustomersComponent>;
  let serviceSpy: { getCustomers: ReturnType<typeof vi.fn>; deleteCustomer: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    serviceSpy = {
      getCustomers: vi.fn().mockReturnValue(of(customerData)),
      deleteCustomer: vi.fn().mockReturnValue(of(true)),
    };

    await TestBed.configureTestingModule({
      imports: [SimpleCustomersComponent, NoopAnimationsModule],
      providers: [{ provide: CustomersService, useValue: serviceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load customers using resource', async () => {
    await fixture.whenStable();
    expect(component.customers.hasValue()).toBe(true);
    expect(component.customers.value()?.length).toBe(4);
  });

  it('should display customer rows in the template', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.customerrow');
    expect(rows.length).toBe(4);
  });

  it('should call deleteCustomer on service when deleteCustomer is called', async () => {
    await fixture.whenStable();
    component.deleteCustomer(customerData[0]);
    expect(serviceSpy.deleteCustomer).toHaveBeenCalledWith(customerData[0].id);
  });

  it('should reload the resource after deletion', async () => {
    await fixture.whenStable();
    component.deleteCustomer(customerData[1]);
    await fixture.whenStable();
    expect(serviceSpy.getCustomers).toHaveBeenCalledTimes(2);
  });
});
