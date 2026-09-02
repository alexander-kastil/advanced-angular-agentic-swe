import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppInitService {
  private http = inject(HttpClient);

  async loadData() {
    const users = await firstValueFrom(
      this.http.get<unknown[]>('https://jsonplaceholder.typicode.com/users')
    );
    console.log('app init loaded users:', users.length);
  }
}
