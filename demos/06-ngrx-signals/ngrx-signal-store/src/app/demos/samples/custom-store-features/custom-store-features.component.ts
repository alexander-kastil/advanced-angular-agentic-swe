import { Component, computed, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { SyncStore } from './sync.store';

@Component({
  selector: 'app-custom-store-features',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatButton, MatProgressBar],
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
