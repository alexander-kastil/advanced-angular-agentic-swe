import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, applyEach, min, max, pattern, schema } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { JsonPipe } from '@angular/common';

interface VetVisit {
    vetName: string;
    reason: string;
    year: string;
}

interface PetHealthModel {
    petName: string;
    vetVisits: VetVisit[];
}

const initialVisit: VetVisit = { vetName: '', reason: '', year: '' };

const initialData: PetHealthModel = {
    petName: '',
    vetVisits: [],
};

const visitSchema = schema<VetVisit>((path) => {
    required(path.vetName, { message: 'Vet name is required' });
    required(path.reason, {
        message: 'Reason is required when vet is entered',
        when: (ctx) => Boolean(ctx.valueOf(path.vetName)),
    });
    min(path.year, 2000, { message: 'Year must be 2000 or later' });
    max(path.year, new Date().getFullYear(), { message: 'Year cannot be in the future' });
    pattern(path.year, /^\d{4}$/, { message: 'Year must be four digits (YYYY)' });
});

@Component({
    selector: 'app-sf-arrays-objects',
    templateUrl: './signal-form-arrays-objects.component.html',
    imports: [
        MarkdownRendererComponent,
        MatCard, MatCardHeader, MatCardTitle, MatCardContent,
        FormField, MatFormField, MatLabel, MatInput,
        MatButton, JsonPipe, ColumnDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SfArraysObjectsComponent {
    petModel = signal<PetHealthModel>(initialData);

    petForm = form(this.petModel, (s) => {
        required(s.petName, { message: 'Pet name is required' });
        applyEach(s.vetVisits, visitSchema);
    });

    addVisit(): void {
        this.petModel.update((m) => ({
            ...m,
            vetVisits: [...m.vetVisits, { ...initialVisit }],
        }));
    }

    removeVisit(index: number): void {
        this.petModel.update((m) => ({
            ...m,
            vetVisits: m.vetVisits.filter((_, i) => i !== index),
        }));
    }

    onSubmit(): void {
        if (this.petForm().valid()) {
            console.log('Submitted:', this.petModel());
        }
    }

    onCancel(): void {
        this.petForm().reset(initialData);
    }
}

