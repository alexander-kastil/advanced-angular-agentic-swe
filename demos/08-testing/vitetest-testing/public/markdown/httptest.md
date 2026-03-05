# Service HTTP Test — CustomersService

Test Angular services that use `HttpClient` with `HttpTestingController` to mock HTTP requests and verify API interactions without making real network calls.

## Overview

When testing services that fetch data from APIs, you need to:

1. Mock the HTTP layer with `HttpTestingController`
2. Control the request flow and flush mock responses
3. Assert that correct URLs, methods, and payloads were sent
4. Verify service transforms the response correctly

## Setup

Import testing utilities and configure TestBed with HTTP providers:

```typescript
import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CustomersService } from "./customers.service";

describe("CustomersService", () => {
  let service: CustomersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomersService],
    });
    service = TestBed.inject(CustomersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unhandled HTTP requests remain
    httpMock.verify();
  });
});
```

## Testing GET Requests

```typescript
it("should fetch customers from API", () => {
  const mockCustomers = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
  ];

  service.getCustomers().subscribe((customers) => {
    expect(customers).toEqual(mockCustomers);
  });

  // Assert exactly one request was made
  const req = httpMock.expectOne("/api/customers");

  // Verify request method
  expect(req.request.method).toBe("GET");

  // Deliver mock response
  req.flush(mockCustomers);
});
```

## Testing POST Requests

```typescript
it("should create a new customer", () => {
  const newCustomer = { name: "Alice" };
  const mockResponse = { id: 3, ...newCustomer };

  service.createCustomer(newCustomer).subscribe((result) => {
    expect(result.id).toBe(3);
    expect(result.name).toBe("Alice");
  });

  const req = httpMock.expectOne("/api/customers");
  expect(req.request.method).toBe("POST");

  // Assert request body contains sent data
  expect(req.request.body).toEqual(newCustomer);

  req.flush(mockResponse);
});
```

## Testing PUT/UPDATE Requests

```typescript
it("should update a customer", () => {
  const customerId = 1;
  const updates = { name: "Updated Name" };
  const mockResponse = { id: customerId, ...updates };

  service.updateCustomer(customerId, updates).subscribe((result) => {
    expect(result.name).toBe("Updated Name");
  });

  const req = httpMock.expectOne(`/api/customers/${customerId}`);
  expect(req.request.method).toBe("PUT");
  expect(req.request.body).toEqual(updates);

  req.flush(mockResponse);
});
```

## Testing DELETE Requests

```typescript
it("should delete a customer", () => {
  const customerId = 1;

  service.deleteCustomer(customerId).subscribe(() => {
    // Expect empty response for DELETE
    expect(true).toBe(true);
  });

  const req = httpMock.expectOne(`/api/customers/${customerId}`);
  expect(req.request.method).toBe("DELETE");

  req.flush(null); // DELETE typically returns empty response
});
```

## Testing Error Scenarios

```typescript
it("should handle 404 errors", () => {
  service.getCustomer(999).subscribe(
    () => expect(true).toBe(false), // Should not succeed
    (error) => {
      expect(error.status).toBe(404);
    },
  );

  const req = httpMock.expectOne("/api/customers/999");
  req.flush("Customer not found", { status: 404, statusText: "Not Found" });
});

it("should handle server errors", () => {
  service.getCustomers().subscribe(
    () => expect(true).toBe(false),
    (error) => {
      expect(error.status).toBe(500);
    },
  );

  const req = httpMock.expectOne("/api/customers");
  req.error(new ErrorEvent("Server error"), { status: 500 });
});
```

## Key Concepts

- **HttpTestingController.expectOne()** - Asserts exactly one matching request was made. Use the URL pattern (string or regex) to match requests
- **httpMock.verify()** - In afterEach, ensures no unexpected HTTP requests remain. Catches forgotten expectations
- **req.flush(data)** - Delivers the mock response data to the Observable
- **req.request** - Inspect the request object to verify method, URL, headers, and body
- **Test all HTTP verbs** - GET (retrieve), POST (create), PUT (update), DELETE (remove)
- **Error handling** - Use req.flush(data, errorResponse) or req.error() to test failure paths
