import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.scss'],
})
export class FormControlComponent implements OnInit {
  name = new FormControl('',
    [Validators.required, Validators.minLength(3)],
    []);
  postal = new UntypedFormControl('3544', [Validators.minLength(4)]);
  city = new FormControl<string>('Idolsberg', [Validators.maxLength(15)]);

  ngOnInit() {
    this.subscribeNameChanges();
  }

  subscribeNameChanges() {
    this.name.valueChanges.subscribe((data) =>
      console.log('Form values changed', data)
    );
    this.name.statusChanges.subscribe((data) =>
      console.log('Form status changed', data)
    );
  }

  logName() {
    console.log("current name:", this.name.value);
  }

  updateName() {
    this.name.setValue('Soi');
  }
}
