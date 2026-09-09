import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const process: { env: Record<string, string | undefined> };

/**
 * The browser reaches the API through the dev-server proxy on a relative path.
 * The server has no proxy, so a relative URL there resolves against nothing.
 */
export const API_BASE = new InjectionToken<string>('API_BASE', {
  providedIn: 'root',
  factory: () => {
    if (isPlatformBrowser(inject(PLATFORM_ID))) return '';
    // In the compose stack the API answers on its service name; locally it is the mapped port.
    return process.env['VAULT_API_ORIGIN'] ?? 'http://localhost:5093';
  },
});
