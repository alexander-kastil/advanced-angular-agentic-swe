import { Component, computed, inject } from '@angular/core';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { SyncStore } from './sync.store';

@Component({
  selector: 'app-custom-store-features',
  imports: [ProgressBarComponent],
  providers: [SyncStore],
  templateUrl: './custom-store-features.component.html',
  styleUrl: './custom-store-features.component.scss',
})
export class CustomStoreFeaturesComponent {
  protected store = inject(SyncStore);
  protected statusLabel = computed(() => {
    const status = this.store.requestStatus();
    return typeof status === 'object' ? 'error' : status;
  });
}
