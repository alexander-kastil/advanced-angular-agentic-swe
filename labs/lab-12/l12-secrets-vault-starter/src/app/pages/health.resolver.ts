import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResolveFn } from '@angular/router';
import { catchError, firstValueFrom, of } from 'rxjs';
import { API_BASE } from '../shared/api-base';

export const healthResolver: ResolveFn<string> = async () => {
  const http = inject(HttpClient);
  const base = inject(API_BASE);

  return await firstValueFrom(
    http
      .get(`${base}/health`, { responseType: 'text' })
      .pipe(catchError(() => of('unreachable'))),
  );
};
