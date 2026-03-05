import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { form, FormField, required, validate, min, max } from '@angular/forms/signals';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { JsonPipe } from '@angular/common';

interface PetAdoptionModel {
    petName: string;
    age: number;
    wantsInsurance: boolean;
    wantsTraining: boolean;
    contactEmail: string;
    contactPhone: string;
}

const initialData: PetAdoptionModel = {
    petName: '',
    age: NaN,
    wantsInsurance: true,
    wantsTraining: true,
    contactEmail: '',
    contactPhone: '',
};

@Component({
    selector: 'app-sf-validate',
    templateUrl: './signal-form-validate.component.html',
    imports: [
        MarkdownRendererComponent,
        MatCard, MatCardHeader, MatCardTitle, MatCardContent,
        FormField, MatFormField, MatLabel, MatInput,
        MatCheckbox, JsonPipe, ColumnDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SfValidateComponent {
    adoptionModel = signal<PetAdoptionModel>(initialData);

    adoptionForm = form(this.adoptionModel, (s) => {
        required(s.petName, { message: 'Pet name is required' });
        required(s.age, { message: 'Age is required' });
        min(s.age, 0, { message: 'Age cannot be negative' });
        max(s.age, 30, { message: 'Age must be 30 or less' });

        validate(s.wantsInsurance, (ctx) => {
            const insurance = ctx.value();
            const training = ctx.valueOf(s.wantsTraining);
            return checkService(insurance, training);
        });

        validate(s.contactEmail, (ctx) => {
            const email = ctx.value();
            const phone = ctx.valueOf(s.contactPhone);
            if (!email && !phone) {
                return { kind: 'contactMissing', message: 'Provide either email or phone' };
            }
            return null;
        });
    });

    eff = effect(() => console.log('Adoption model:', this.adoptionModel()));
}

function checkService(insurance: boolean, training: boolean) {
    if (insurance || training) return null;
    return {
        kind: 'serviceMissing',
        message: 'Must select at least one service (Insurance or Training)',
    };
}

