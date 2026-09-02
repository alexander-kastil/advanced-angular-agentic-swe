import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-control-value-accessor',
  templateUrl: './control-value-accessor.component.html',
  styleUrls: ['./control-value-accessor.component.scss'],
})
export class ControlValueAccessorComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  shoppingForm: FormGroup<{
    itemName: FormControl<string | null>;
    quantity: FormControl<number | null>;
  }> = this.fb.group({
    itemName: '',
    quantity: 0,
  });

  cartItem = { itemName: 'sunflower oil', quantity: 4 };

  constructor() {
    this.shoppingForm.controls.quantity.valueChanges.subscribe((value) => {
      console.log('Quantity changed:', value);
    });

    this.shoppingForm.valueChanges.subscribe((value) => {
      console.log('Form changed:', value);
    });
  }

  ngOnInit(): void {
    this.shoppingForm = this.fb.group({
      itemName: [this.cartItem.itemName, Validators.required],
      quantity: [this.cartItem.quantity],
    });
  }

  submitCart() {
    console.log('Items in cart:', this.shoppingForm);
  }
}
