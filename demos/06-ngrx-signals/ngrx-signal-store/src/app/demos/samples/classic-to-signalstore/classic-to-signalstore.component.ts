import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { classicSample, migrationPrompt, signalStoreSample } from './migration-samples';
import { MigrationReviewStore } from './migration-review.store';

@Component({
  selector: 'app-classic-to-signalstore',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatTabGroup,
    MatTab,
    MatCheckbox,
    MatButton,
    MatProgressBar,
  ],
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

  protected async copyPrompt() {
    await navigator.clipboard.writeText(this.prompt);
    this.copied.set(true);
  }
}
