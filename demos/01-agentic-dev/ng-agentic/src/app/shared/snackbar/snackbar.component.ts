import { Component, inject } from '@angular/core';
import { SnackbarService } from './snackbar.service';

@Component({
  selector: 'app-snackbar',
  template: `
    @if (service.snack(); as snack) {
      <div class="fixed bottom-6 left-1/2 z-100 flex -translate-x-1/2 items-center gap-4 rounded bg-primary px-4 py-2 text-sm text-white shadow-lg">
        <span>{{ snack.title }}</span>
        <button type="button" class="cursor-pointer font-medium uppercase hover:underline" (click)="service.dismiss()">
          {{ snack.msg }}
        </button>
      </div>
    }
  `,
})
export class SnackbarComponent {
  protected service = inject(SnackbarService);
}
