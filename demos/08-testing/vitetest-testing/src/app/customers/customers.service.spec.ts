import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Customer } from './customer.model';
import { CustomersService } from './customers.service';
import { environment } from '../../environments/environment';

describe('Service - HTTP Test - CustomersService', () => {
  let service: CustomersService;
  let controller: HttpTestingController;
  const baseUrl = `${environment.api}customers`;

  const mockCustomers: Customer[] = [
    { id: 1, name: 'Soi' },
    { id: 2, name: 'Giro' },
    { id: 3, name: 'Flora' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomersService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(CustomersService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should return all customers', () => {
    service.getCustomers().subscribe((customers) => {
      expect(customers.length).toBe(3);
      expect(customers[0].name).toBe('Soi');
    });

    const req = controller.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomers);
  });

  it('should add a new customer via POST', () => {
    const newCustomer: Customer = { id: 0, name: 'NewCustomer' };
    const created: Customer = { id: 4, name: 'NewCustomer' };

    service.addCustomer(newCustomer).subscribe((result) => {
      expect(result.id).toBe(4);
      expect(result.name).toBe('NewCustomer');
    });

    const req = controller.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCustomer);
    req.flush(created);
  });

  it('should update a customer via PUT', () => {
    const updated: Customer = { id: 2, name: 'Giro Updated' };

    service.updateCustomer(updated).subscribe((result) => {
      expect(result.name).toBe('Giro Updated');
    });

    const req = controller.expectOne(`${baseUrl}/${updated.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updated);
    req.flush(updated);
  });

  it('should delete a customer via DELETE', () => {
    service.deleteCustomer(3).subscribe((result) => {
      expect(result).toBeTruthy();
    });

    const req = controller.expectOne(`${baseUrl}/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
