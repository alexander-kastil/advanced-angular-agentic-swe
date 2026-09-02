import { Component, effect, inject, signal } from '@angular/core';
import { LoadingService } from './loading.service';

const MIN_VISIBLE_MS = 400;

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  private service = inject(LoadingService);
  private shownAt = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;

  protected visible = signal(false);

  constructor() {
    effect(() => {
      const loading = this.service.getLoading()();

      if (loading) {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        if (!this.visible()) {
          this.shownAt = Date.now();
          this.visible.set(true);
        }
        return;
      }

      if (!this.visible() || this.timer) {
        return;
      }

      const remaining = MIN_VISIBLE_MS - (Date.now() - this.shownAt);
      if (remaining <= 0) {
        this.visible.set(false);
        return;
      }
      this.timer = setTimeout(() => {
        this.timer = null;
        this.visible.set(false);
      }, remaining);
    });
  }
}
