import { Component, inject, signal } from '@angular/core';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { classicSample, migrationPrompt, signalStoreSample } from './migration-samples';
import { MigrationReviewStore } from './migration-review.store';

@Component({
  selector: 'app-classic-to-signalstore',
  imports: [ProgressBarComponent],
  providers: [MigrationReviewStore],
  templateUrl: './classic-to-signalstore.component.html',
  styleUrl: './classic-to-signalstore.component.scss',
})
export class ClassicToSignalStoreComponent {
  protected store = inject(MigrationReviewStore);
  protected readonly classic = classicSample;
  protected readonly signalStore = signalStoreSample;
  protected readonly prompt = migrationPrompt;
  protected readonly copied = signal(false);
  protected readonly tabs = ['Before - classic NgRx', 'After - SignalStore', 'Prompt'];
  protected readonly tab = signal(this.tabs[0]);

  protected async copyPrompt() {
    await navigator.clipboard.writeText(this.prompt);
    this.copied.set(true);
  }
}
