import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { form, FormField, required, applyWhen } from '@angular/forms/signals';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { JsonPipe } from '@angular/common';

type PetType = 'cat' | 'dog';

interface PetWhenModel {
    name: string;
    type: PetType;
    hasAllergies: boolean;
    allergyDetails: string;
    isOutdoor: boolean;
    leashColor: string;
}

const initialData: PetWhenModel = {
    name: '',
    type: 'cat',
    hasAllergies: false,
    allergyDetails: '',
    isOutdoor: false,
    leashColor: '',
};

@Component({
    selector: 'app-sf-when',
    templateUrl: './signal-form-when.component.html',
    imports: [
        MarkdownRendererComponent,
        MatCard, MatCardHeader, MatCardTitle, MatCardContent,
        FormField, MatFormField, MatLabel, MatInput,
        MatCheckbox, MatSelectModule, JsonPipe, ColumnDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SfWhenComponent {
    petModel = signal<PetWhenModel>(initialData);

    petForm = form(this.petModel, (s) => {
        required(s.name, { message: 'Pet name is required' });

        required(s.allergyDetails, {
            message: 'Allergy details are required when pet has allergies',
            when: ({ valueOf }) => valueOf(s.hasAllergies) === true,
        });

        applyWhen(
            s.leashColor,
            ({ valueOf }) => valueOf(s.isOutdoor) === true,
            (leashPath) => {
                required(leashPath, { message: 'Leash color is required for outdoor pets' });
            }
        );
    });

    eff = effect(() => console.log('Pet model:', this.petModel()));
}

