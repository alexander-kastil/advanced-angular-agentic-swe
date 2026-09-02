import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

export type Frequency = 'immediately' | 'daily' | 'weekly';

@Component({
  selector: 'app-notification-prefs',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  template: `
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title>Notification preferences</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="fields">
          <mat-slide-toggle [(ngModel)]="enabled">Send notifications</mat-slide-toggle>

          <mat-checkbox [(ngModel)]="byEmail" [disabled]="!enabled()">Email</mat-checkbox>
          <mat-checkbox [(ngModel)]="bySms" [disabled]="!enabled()">SMS</mat-checkbox>

          <mat-form-field>
            <mat-label>Frequency</mat-label>
            <mat-select [(ngModel)]="frequency" [disabled]="!enabled()">
              @for (option of frequencies; track option) {
                <mat-option [value]="option">{{ option }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <div data-testid="summary">{{ summary() }}</div>

        @if (saved(); as value) {
          <div data-testid="saved">saved: {{ value }}</div>
        }
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" [disabled]="!canSave()" (click)="save()">
          Save preferences
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .fields { display: flex; flex-direction: column; gap: .75rem; max-width: 20rem; margin-bottom: 1rem; }
  `],
})
export class NotificationPrefsComponent {
  readonly frequencies: Frequency[] = ['immediately', 'daily', 'weekly'];

  readonly enabled = signal(false);
  readonly byEmail = signal(false);
  readonly bySms = signal(false);
  readonly frequency = signal<Frequency>('daily');
  readonly saved = signal('');

  readonly channels = computed(() => {
    const picked: string[] = [];
    if (this.byEmail()) picked.push('email');
    if (this.bySms()) picked.push('sms');
    return picked;
  });

  readonly canSave = computed(() => !this.enabled() || this.channels().length > 0);

  readonly summary = computed(() =>
    this.enabled()
      ? `${this.channels().join(' and ') || 'no channel'} ${this.frequency()}`
      : 'notifications are off'
  );

  save(): void {
    this.saved.set(this.summary());
  }
}
