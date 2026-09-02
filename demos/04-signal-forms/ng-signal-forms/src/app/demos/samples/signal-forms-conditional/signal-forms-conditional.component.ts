import { Component, signal } from '@angular/core';
import { form, FormField, hidden, disabled, readonly } from '@angular/forms/signals';
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
    templateUrl: './signal-forms-conditional.component.html',
    imports: [
        FormField,
        JsonPipe,
        ColumnDirective,
    ]
})
export class SignalFormsConditionalComponent {
    model = signal<ConditionalModel>({
        subscribe: false,
        email: '',
        username: 'admin',
        promoCode: '',
    });

    fields = form(this.model, (s) => {
        hidden(s.email, ({ valueOf }) => !valueOf(s.subscribe));
        disabled(s.promoCode, ({ valueOf }) => !valueOf(s.subscribe));
        readonly(s.username);
    });
}

