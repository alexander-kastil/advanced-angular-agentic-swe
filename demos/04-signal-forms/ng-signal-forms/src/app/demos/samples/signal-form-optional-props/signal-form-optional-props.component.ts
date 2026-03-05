import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { form, FormField, required, minLength } from '@angular/forms/signals';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { JsonPipe } from '@angular/common';

interface PetDomain {
    petName: string;
    breed: string;
    microchipId?: string;
}

interface PetFormModel {
    petName: string;
    breed: string;
    microchipId: string;
}

const initialData: PetFormModel = {
    petName: '',
    breed: '',
    microchipId: '',
};

@Component({
    selector: 'app-sf-optional-props',
    templateUrl: './signal-form-optional-props.component.html',
    imports: [
        MarkdownRendererComponent,
        MatCard, MatCardHeader, MatCardTitle, MatCardContent,
        FormField, MatFormField, MatLabel, MatInput,
        JsonPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SfOptionalPropsComponent {
    petModel = signal<PetFormModel>(initialData);

    petForm = form(this.petModel, (s) => {
        required(s.petName, { message: 'Pet name is required' });
        required(s.breed, { message: 'Breed is required' });
        minLength(s.microchipId, 10, { message: 'Microchip ID must be at least 10 characters' });
    });

    eff = effect(() => {
        console.log('--- MODEL ---');
        console.log('petName:', this.petModel().petName);
        console.log('breed:', this.petModel().breed);
        console.log('microchipId:', this.petModel().microchipId);
        console.log('--- FORM (FieldTree) ---');
        console.log('petName found?', !!this.petForm.petName);
        console.log('breed found?', !!this.petForm.breed);
        console.log('microchipId found?', !!this.petForm.microchipId);
    });

    onSubmit(): void {
        if (this.petForm().valid()) {
            console.log('Submitted:', this.petModel());
        }
    }

    onCancel(): void {
        this.petForm().reset(initialData);
    }
}

