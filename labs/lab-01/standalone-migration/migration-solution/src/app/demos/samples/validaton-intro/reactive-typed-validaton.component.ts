import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatError } from '@angular/material/form-field';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-reactive-typed-validation',
    templateUrl: './reactive-typed-validation.component.html',
    styleUrls: ['./reactive-typed-validation.component.scss'],
    standalone: true,
    imports: [
        MarkdownRendererComponent,
        FormsModule,
        ReactiveFormsModule,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        ColumnDirective,
        MatFormField,
        MatInput,
        MatError,
        MatCardActions,
        MatButton,
        JsonPipe,
    ],
})
export class ReactiveTypedValidationComponent {
  registerForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),

      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(4)],
        nonNullable: true,
      }),
      passwordRepeat: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    },
    {
      updateOn: 'blur',
      validators: [this.passwordsMatchValidator],
    }
  );

  registerUser(form: FormGroup) {
    const usr = {
      email: form.controls['email'].value,
      password: form.controls['password'].value,
    };
    console.log('User to register: ', usr);
    console.log('Form: ', form);
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const pwd = control.get('password')?.value;
    const repeat = control.get('passwordRepeat')?.value;
    return pwd && repeat && pwd === repeat ? null : { passwordMismatch: true };
  }
}
