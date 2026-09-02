import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, hidden, disabled, readonly } from '@angular/forms/signals';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { JsonPipe } from '@angular/common';

interface ConditionalModel {
    subscribe: boolean;
    email: string;
    username: string;
    promoCode: string;
}

@Component({
    selector: 'app-signal-forms-conditional',
    templateUrl: './signal-form-conditional.component.html',
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
        MatCheckbox,
        JsonPipe,
        ColumnDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormsConditionalComponent {
    model = signal<ConditionalModel>({
        subscribe: false,
        email: '',
        username: 'admin',
        promoCode: '',
    });

    fields = form(this.model, (s) => {
        // email is hidden when subscribe is false
        hidden(s.email, ({ valueOf }) => !valueOf(s.subscribe));
        // promoCode is disabled when subscribe is false
        disabled(s.promoCode, ({ valueOf }) => !valueOf(s.subscribe));
        // username is always readonly
        readonly(s.username);
    });
}

