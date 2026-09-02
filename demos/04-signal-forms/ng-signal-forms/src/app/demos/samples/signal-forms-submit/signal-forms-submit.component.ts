import { Component, signal } from '@angular/core';
import { FormField, FormRoot, email, form, minLength, required, submit } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';

interface LoginModel {
    email: string;
    password: string;
}

const KNOWN_USER = 'cleothewhippet@integrations.at';

@Component({
    selector: 'app-signal-forms-submit',
    templateUrl: './signal-forms-submit.component.html',
    imports: [
        MarkdownRendererComponent,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatCardActions,
        FormField,
        FormRoot,
        MatFormField,
        MatLabel,
        MatInput,
        MatButton,
        ColumnDirective,
    ]
})
export class SignalFormsSubmitComponent {
    submitted = signal(false);
    attempts = signal(0);
    serverMessage = signal<string | null>(null);

    model = signal<LoginModel>({ email: '', password: '' });

    loginForm = form(
        this.model,
        (s) => {
            required(s.email, { message: 'Email is required' });
            email(s.email, { message: 'Invalid email address' });
            required(s.password, { message: 'Password is required' });
            minLength(s.password, 6, { message: 'Password must be at least 6 characters' });
        },
        {
            submission: {
                action: async (field) => {
                    this.submitted.set(true);
                    this.serverMessage.set(null);
                    if (field.email().value() !== KNOWN_USER) {
                        return {
                            kind: 'unknownUser',
                            message: 'No account for that address',
                            fieldTree: field.email,
                        };
                    }
                    return null;
                },
                onInvalid: () => this.attempts.update((count) => count + 1),
                ignoreValidators: 'pending',
            },
        },
    );

    loginIgnoringValidation(): void {
        submit(this.loginForm, {
            action: async () => {
                this.serverMessage.set('Forced submit: validators were ignored');
                return null;
            },
            ignoreValidators: 'all',
        });
    }

    reset(): void {
        this.model.set({ email: '', password: '' });
        this.loginForm().reset();
        this.submitted.set(false);
        this.attempts.set(0);
        this.serverMessage.set(null);
    }
}
