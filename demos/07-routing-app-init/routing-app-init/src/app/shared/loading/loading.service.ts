import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private isLoading = signal(false);

  getLoading() {
    return this.isLoading.asReadonly();
  }

  setLoading(loading: boolean) {
    this.isLoading.set(loading);
  }
}
