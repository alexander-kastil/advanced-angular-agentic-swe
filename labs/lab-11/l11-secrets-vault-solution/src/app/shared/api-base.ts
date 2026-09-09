import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * The browser reaches the API through the dev-server proxy on a relative path.
 * The server has no proxy, so a relative URL there resolves against nothing.
 */
export const API_BASE = new InjectionToken<string>('API_BASE', {
  providedIn: 'root',
  factory: () => (isPlatformBrowser(inject(PLATFORM_ID)) ? '' : 'http://localhost:5093'),
});
