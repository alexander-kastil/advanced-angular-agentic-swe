import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal
} from '@angular/core';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrl: './number-picker.component.scss',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberPickerComponent {
  readonly increment = input<number>(1);
  readonly initialValue = input<number>(0);
  readonly amountChanged = output<number>();

  readonly quantity = signal<number>(this.initialValue());
  readonly disabled = signal<boolean>(false);
  readonly touched = signal<boolean>(false);

  onAdd() {
    this.markAsTouched();
    if (!this.disabled()) {
      const newQuantity = this.quantity() + this.increment();
      this.quantity.set(newQuantity);
      this.amountChanged.emit(newQuantity);
    }
  }

  onRemove() {
    this.markAsTouched();
    if (!this.disabled() && this.quantity() > 0) {
      const newQuantity = this.quantity() - this.increment();
      this.quantity.set(newQuantity);
      this.amountChanged.emit(newQuantity);
    }
  }

  private markAsTouched() {
    if (!this.touched()) {
      this.touched.set(true);
    }
  }
}

