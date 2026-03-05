import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Album } from './httpresource-route-resolver.component';

/**
 * HTTP-based resolver using ResolveFn.
 * Returns Album data directly (no async/await needed for simple cases).
 * The router waits for the promise/observable to resolve before activating the component.
 */
export const httpResourceAlbumResolver: ResolveFn<Album> = (route) => {
  const http = inject(HttpClient);
  const id = route.paramMap.get('id') || '1';

  // Return the observable directly - Angular Router handles subscription
  return http.get<Album>(`https://jsonplaceholder.typicode.com/albums/${id}`);
};
