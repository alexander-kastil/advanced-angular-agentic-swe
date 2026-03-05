import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ResolvedData {
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

export const routeDataResolver: ResolveFn<ResolvedData> = async (route) => {
    const http = inject(HttpClient);
    const id = route.paramMap.get('id') || '1';

    return await firstValueFrom(
        http.get<ResolvedData>(`https://jsonplaceholder.typicode.com/albums/${id}`)
    );
};
