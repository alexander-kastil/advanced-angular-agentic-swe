import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-configure-zoneless',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './configure-zoneless.component.html',
    styleUrl: './configure-zoneless.component.scss'
})
export class ConfigureZonelessComponent {
    private fb = inject(FormBuilder);
    
    form!: FormGroup;
    submitted = signal(false);
    changeCount = signal(0);
    
    formValueCount = computed(() => {
        this.changeCount();
        return this.form?.get('email')?.value || '';
    });

    constructor() {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    onEmailChange() {
        this.changeCount.update(v => v + 1);
    }

    onSubmit() {
        this.submitted.set(true);
        if (this.form.valid) {
            console.log('Form submitted:', this.form.value);
        }
    }
}
