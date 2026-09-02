import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormField, disabled, form, min, required, validate } from '@angular/forms/signals';
import { BoxedDirective, ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { MoneyInputComponent } from './money-input.component';
import { RatingInputComponent } from './rating-input.component';

interface ReviewModel {
  title: string;
  rating: number;
  refund: number | null;
}

@Component({
  selector: 'app-form-value-control',
  templateUrl: './form-value-control.component.html',
  styleUrls: ['./form-value-control.component.scss'],
  imports: [
    FormField,
    BoxedDirective, ColumnDirective, JsonPipe,
    RatingInputComponent, MoneyInputComponent,
  ],
})
export class FormValueControlComponent {
  readonly lockRating = signal(false);

  readonly model = signal<ReviewModel>({ title: '', rating: 0, refund: null });

  readonly reviewForm = form(this.model, (s) => {
    required(s.title, { message: 'Give the review a title' });
    min(s.rating, 1, { message: 'Pick at least one star' });
    disabled(s.rating, () => this.lockRating());
    validate(s.refund, ({ value }) => {
      const amount = value();
      return amount !== null && amount < 0
        ? { kind: 'negative', message: 'Refunds cannot be negative' }
        : null;
    });
  });

  toggleLock(): void {
    this.lockRating.update((locked) => !locked);
  }

  resetReview(): void {
    this.model.set({ title: '', rating: 0, refund: null });
    this.reviewForm().reset();
  }
}
