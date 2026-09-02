import { Component, input, model, output } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';

@Component({
  selector: 'app-rating-input',
  styleUrls: ['./rating-input.component.scss'],
  template: `
    <div class="rating" role="radiogroup" [attr.aria-label]="label()">
      @for (star of stars; track star) {
        <button
          type="button"
          role="radio"
          class="star"
          [class.filled]="star <= value()"
          [attr.aria-checked]="star === value()"
          [attr.aria-label]="star + ' of 5'"
          [disabled]="disabled()"
          (click)="pick(star)"
          (blur)="touch.emit()"
        >
          &#9733;
        </button>
      }
      <span class="readout">{{ value() }} / 5</span>
    </div>
    @if (touched() && errors().length) {
      @for (err of errors(); track err.kind) {
        <div class="error">{{ err.message }}</div>
      }
    }
  `,
})
export class RatingInputComponent implements FormValueControl<number> {
  readonly value = model.required<number>();
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly disabled = input(false);
  readonly touched = input(false);
  readonly label = input('Rating');
  readonly touch = output<void>();

  protected readonly stars = [1, 2, 3, 4, 5];

  protected pick(star: number): void {
    this.value.set(star);
    this.touch.emit();
  }
}
