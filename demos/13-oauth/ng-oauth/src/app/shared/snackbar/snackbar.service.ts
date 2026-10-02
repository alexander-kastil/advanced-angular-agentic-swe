import { Injectable, signal } from '@angular/core';

export type Snack = { title: string; msg: string };

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private timer: ReturnType<typeof setTimeout> | null = null;
  readonly snack = signal<Snack | null>(null);

  displayAlert(title: string, msg: string) {
    if (this.timer) clearTimeout(this.timer);
    this.snack.set({ title, msg });
    this.timer = setTimeout(() => this.snack.set(null), 1000);
  }

  dismiss() {
    if (this.timer) clearTimeout(this.timer);
    this.snack.set(null);
  }
}
