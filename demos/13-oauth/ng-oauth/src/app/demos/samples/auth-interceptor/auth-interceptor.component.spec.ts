import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { authInterceptor } from '../../../auth/auth.interceptor';
import { AuthStore } from '../../../auth/auth.store';
import { echoBackendInterceptor } from '../../../auth/echo-backend.interceptor';
import { AuthInterceptorComponent } from './auth-interceptor.component';

describe('AuthInterceptorComponent', () => {
  const create = () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([authInterceptor, echoBackendInterceptor]))]
    });
    return TestBed.createComponent(AuthInterceptorComponent).componentInstance;
  };

  it('is rejected by the api while signed out', async () => {
    const component = create();

    await component.call(component.targets[0]);

    expect(component.outcomes()[0].status).toBe(401);
  });

  it('sends the token to the api and nowhere else', async () => {
    const component = create();
    TestBed.inject(AuthStore).login('Ada Lovelace');

    await component.call(component.targets[0]);
    await component.call(component.targets[2]);

    const [attacker, api] = component.outcomes();
    expect(api.authorization).toMatch(/^Bearer /);
    expect(attacker.authorization).toBe('(none)');
  });
});
