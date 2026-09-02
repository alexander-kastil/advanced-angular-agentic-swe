import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-material',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
  imports: [
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatButtonModule
  ]
})
export class MaterialComponent {
  value = 50;
  validated = false;
  sliderForm: FormGroup;

  constructor() {
    this.sliderForm = new FormGroup({
      slider: new FormControl(this.value, Validators.min(1)),
    });

    this.sliderForm.valueChanges.subscribe(
      (data: any) => (this.value = data.slider)
    );
  }

  resetSlider() {
    this.sliderForm.controls['slider'].setValue(1);
  }
}
