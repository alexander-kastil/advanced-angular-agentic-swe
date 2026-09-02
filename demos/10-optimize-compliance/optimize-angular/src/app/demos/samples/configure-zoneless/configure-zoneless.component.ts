import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-configure-zoneless',
    imports: [ReactiveFormsModule],
    templateUrl: './configure-zoneless.component.html',
    styleUrl: './configure-zoneless.component.scss'
})
export class ConfigureZonelessComponent {
    private fb = inject(FormBuilder);

    readonly form: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
    });

    readonly submitted = signal(false);
    readonly changeCount = signal(0);

    readonly formValueCount = computed(() => {
        this.changeCount();
        return this.form.get('email')?.value ?? '';
    });

    onEmailChange() {
        this.changeCount.update(value => value + 1);
    }

    onSubmit() {
        this.submitted.set(true);
    }
}
