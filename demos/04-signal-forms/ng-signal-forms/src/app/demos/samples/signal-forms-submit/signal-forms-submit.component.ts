import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, email, minLength, submit } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';

interface LoginModel {
    email: string;
    password: string;
}

@Component({
    selector: 'app-signal-forms-submit',
    templateUrl: './signal-form-submit.component.html',
    imports: [
        MarkdownRendererComponent,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        FormField,
        MatFormField,
        MatLabel,
        MatInput,
        MatButton,
        ColumnDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormsSubmitComponent {
    submitted = signal(false);

    model = signal<LoginModel>({ email: '', password: '' });

    loginForm = form(this.model, (s) => {
        required(s.email, { message: 'Email is required' });
        email(s.email, { message: 'Invalid email address' });
        required(s.password, { message: 'Password is required' });
        minLength(s.password, 6, { message: 'Password must be at least 6 characters' });
    });

    // submit() marks all fields as touched and calls the callback only when valid
    login(): void {
        submit(this.loginForm, async () => {
            this.submitted.set(true);
            console.log('Login with:', this.model());
        });
    }
}

