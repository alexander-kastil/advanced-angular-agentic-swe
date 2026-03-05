import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { form, FormField, required, min, minLength, applyWhenValue } from '@angular/forms/signals';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { JsonPipe } from '@angular/common';

interface PetDomain {
    petName: string;
    breed: string;
    notes: string | null;
    weight: number | null;
    adoptionDate: Date | null;
}

interface PetFormModel {
    petName: string;
    breed: string;
    notes: string;
    weight: number;
    adoptionDate: Date | null;
}

const initialData: PetFormModel = {
    petName: '',
    breed: '',
    notes: '',
    weight: NaN,
    adoptionDate: null,
};

@Component({
    selector: 'app-sf-null-values',
    templateUrl: './signal-form-null-values.component.html',
    imports: [
        MarkdownRendererComponent,
        MatCard, MatCardHeader, MatCardTitle, MatCardContent,
        FormField, MatFormField, MatLabel, MatInput,
        JsonPipe, ColumnDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SfNullValuesComponent {
    petModel = signal<PetFormModel>(initialData);

    petForm = form(this.petModel, (s) => {
        required(s.petName, { message: 'Pet name is required' });
        required(s.breed, { message: 'Breed is required' });
        min(s.weight, 0, { message: 'Weight cannot be negative' });
        applyWhenValue(
            s.notes,
            (value) => value !== null,
            (notesPath) => {
                minLength(notesPath, 5, { message: 'Notes must be at least 5 characters' });
            }
        );
    });

    eff = effect(() => {
        console.log('--- MODEL ---');
        console.log('petName:', this.petModel().petName);
        console.log('notes:', this.petModel().notes);
        console.log('adoptionDate:', this.petModel().adoptionDate);
        console.log('--- FORM ---');
        console.log('petName found?', !!this.petForm.petName);
        console.log('notes found?', !!this.petForm.notes);
        console.log('adoptionDate found?', !!this.petForm.adoptionDate);
    });
}

