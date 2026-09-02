import { Component, input, linkedSignal, output, signal } from '@angular/core';

@Component({
  selector: 'app-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrl: './number-picker.component.scss',
})
export class NumberPickerComponent {
  readonly increment = input<number>(1);
  readonly initialValue = input<number>(0);
  readonly amountChanged = output<number>();

  readonly quantity = linkedSignal(() => this.initialValue());
  readonly touched = signal<boolean>(false);

  onAdd() {
    this.touched.set(true);
    const newQuantity = this.quantity() + this.increment();
    this.quantity.set(newQuantity);
    this.amountChanged.emit(newQuantity);
  }

  onRemove() {
    this.touched.set(true);
    if (this.quantity() > 0) {
      const newQuantity = this.quantity() - this.increment();
      this.quantity.set(newQuantity);
      this.amountChanged.emit(newQuantity);
    }
  }
}
