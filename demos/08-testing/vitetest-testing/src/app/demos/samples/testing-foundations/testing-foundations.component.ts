import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    PhonenumberPipe,
    RatingPipe,
    ComponentClassComponent,
  ],
  template: `
    <div class="grid">
      <div class="card mt-0">
        <div class="card-header"><h2 class="card-title">Plain Class</h2></div>
        <div class="card-content">
          <div data-testid="greeting">{{ greeting }}</div>
          <div>goodVoucher validates: <b>{{ goodVoucherValid }}</b></div>
          <div>badVoucher validates: <b>{{ badVoucherValid }}</b></div>
        </div>
      </div>

      <div class="card mt-0">
        <div class="card-header"><h2 class="card-title">Pipes</h2></div>
        <div class="card-content">
          <div>{{ phone }} &rarr; <b>{{ phone | phonenumber }}</b></div>
          @for (r of ratings; track r) {
            <div>{{ r }} &rarr; <b>{{ r | rating }}</b></div>
          }
        </div>
      </div>

      <div class="card mt-0">
        <div class="card-header"><h2 class="card-title">Service without DI</h2></div>
        <div class="card-content">
          <div class="field">
            <label class="label" for="message-input">New message</label>
            <input
              id="message-input"
              class="input"
              type="text"
              data-testid="message-input"
              [(ngModel)]="draft"
            />
          </div>
          <button type="button" class="btn btn-primary" (click)="addMessage()">Add</button>
          @for (m of messages(); track m) {
            <div class="row">
              <span>{{ m }}</span>
              <button type="button" class="btn btn-warn" (click)="deleteMessage(m)">remove</button>
            </div>
          }
        </div>
      </div>

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
