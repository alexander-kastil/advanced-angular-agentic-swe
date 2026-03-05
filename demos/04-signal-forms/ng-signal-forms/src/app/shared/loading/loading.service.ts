import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private isLoading = signal(false);
  readonly loading = this.isLoading.asReadonly();

  getLoading() {
    return this.loading;
  }

  setLoading(loading: boolean) {
    this.isLoading.set(loading);
  }
}
