import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { map } from 'rxjs';
import { MaterialAsyncComponent } from './material-async.component';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
  imports: [
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatButtonModule,
    MaterialAsyncComponent
  ]
})
export class MaterialComponent {
  readonly sliderForm = new FormGroup({
    slider: new FormControl(50, Validators.min(1)),
  });

  readonly value = toSignal(
    this.sliderForm.valueChanges.pipe(map((data) => data.slider ?? 0)),
    { initialValue: 50 }
  );

  resetSlider() {
    this.sliderForm.controls['slider'].setValue(1);
  }
}
