# Test httpResource — SkillsResourceComponent

Test a component that uses Angular's `httpResource()` for reactive data fetching. Use `HttpTestingController` to flush responses and assert loading state and rendered output.

## Spec file

Navigate to `http-tests-signal/` and examine the component test file.

## Key Concepts

- `httpResource()` uses `HttpClient` internally so `HttpTestingController` works the same way
- Call `fixture.detectChanges()` first to trigger the resource request
- Use `httpMock.expectOne()` to intercept the HTTP request
- Flush the request with `req.flush(mockData)` then call `detectChanges()` again to render the response
- Test loading state before flush and data state after flush
- `resource.isLoading()` and `resource.error()` signals reflect request state
