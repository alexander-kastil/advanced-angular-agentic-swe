import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

export interface Album {
  userId: number;
  id: number;
  title: string;
}

export const albumResolver: ResolveFn<Album> = (route) => {
  const http = inject(HttpClient);
  const id = route.paramMap.get('id') ?? '1';

  return http.get<Album>(`https://jsonplaceholder.typicode.com/albums/${id}`);
};
