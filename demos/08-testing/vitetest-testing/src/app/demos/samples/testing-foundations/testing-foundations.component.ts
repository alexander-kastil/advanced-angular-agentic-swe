import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ComponentClassComponent } from './component-class.component';
import { PhonenumberPipe } from './phonenumber.pipe';
import { RatingPipe } from './rating.pipe';
import { SimpleClass } from './simple-class';
import { SimpleMessageService } from './simple.service';
import { badVoucher, goodVoucher } from './voucher-validator.data';
import { VoucherValidator } from './voucher-validator';

@Component({
  selector: 'app-testing-foundations',
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PhonenumberPipe,
    RatingPipe,
    ComponentClassComponent,
  ],
  template: `
    <div class="grid">
      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>Plain Class</mat-card-title></mat-card-header>
        <mat-card-content>
          <div data-testid="greeting">{{ greeting }}</div>
          <div>goodVoucher validates: <b>{{ goodVoucherValid }}</b></div>
          <div>badVoucher validates: <b>{{ badVoucherValid }}</b></div>
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>Pipes</mat-card-title></mat-card-header>
        <mat-card-content>
          <div>{{ phone }} &rarr; <b>{{ phone | phonenumber }}</b></div>
          @for (r of ratings; track r) {
            <div>{{ r }} &rarr; <b>{{ r | rating }}</b></div>
          }
        </mat-card-content>
      </mat-card>

      <mat-card appearance="outlined">
        <mat-card-header><mat-card-title>Service without DI</mat-card-title></mat-card-header>
        <mat-card-content>
          <mat-form-field>
            <mat-label>New message</mat-label>
            <input matInput data-testid="message-input" [(ngModel)]="draft" />
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="addMessage()">Add</button>
          @for (m of messages(); track m) {
            <div class="row">
              <span>{{ m }}</span>
              <button mat-button color="warn" (click)="deleteMessage(m)">remove</button>
            </div>
          }
        </mat-card-content>
      </mat-card>

      <app-component-class />
    </div>
  `,
  styles: [`
    .grid { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start; }
    .row { display: flex; align-items: center; gap: .5rem; }
  `],
})
export class TestingFoundationsComponent {
  private messageService = inject(SimpleMessageService);

  readonly greeting = new SimpleClass().sayHelloWorld();
  readonly goodVoucherValid = VoucherValidator.validate(goodVoucher);
  readonly badVoucherValid = VoucherValidator.validate(badVoucher);
  readonly phone = '3333333333';
  readonly ratings = [1, 2, 3, 4, 5];

  readonly draft = signal('');
  readonly messages = signal<string[]>([]);

  addMessage() {
    const value = this.draft().trim();
    if (!value) return;
    this.messageService.add(value);
    this.draft.set('');
    this.sync();
  }

  deleteMessage(message: string) {
    this.messageService.delete(message);
    this.sync();
  }

  private sync() {
    this.messages.set([...this.messageService.messages]);
  }
}
