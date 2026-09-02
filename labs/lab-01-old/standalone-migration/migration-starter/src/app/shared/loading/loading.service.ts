import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private isLoading = new BehaviorSubject(false);

  getLoading() {
    return this.isLoading.asObservable();
  }

  setLoading(loading: boolean) {
    this.isLoading.next(loading);
  }
}
