import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { echoBackendInterceptor } from '../../../auth/echo-backend.interceptor';
import { BearerRequestsComponent } from './bearer-requests.component';

describe('BearerRequestsComponent', () => {
  const create = () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([echoBackendInterceptor]))]
    });
    return TestBed.createComponent(BearerRequestsComponent).componentInstance;
  };

  it('gets a 401 without the header', async () => {
    const component = create();

    await component.fullResponse();

    expect(component.result()?.status).toBe(401);
  });

  it('gets a 200 once the bearer header is set', async () => {
    const component = create();

    await component.withHeader();

    expect(component.result()?.status).toBe(200);
    expect(component.result()?.body).toContain('Bearer ');
  });
});
