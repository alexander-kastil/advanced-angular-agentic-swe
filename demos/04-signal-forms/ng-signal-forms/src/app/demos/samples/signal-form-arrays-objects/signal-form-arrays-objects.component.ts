import { Component, signal } from '@angular/core';
import { form, FormField, required, applyEach, min, max, schema } from '@angular/forms/signals';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { JsonPipe } from '@angular/common';

interface VetVisit {
    vetName: string;
    reason: string;
    year: number | null;
}

interface PetHealthModel {
    petName: string;
    vetVisits: VetVisit[];
}

const initialVisit: VetVisit = { vetName: '', reason: '', year: null };

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
});

@Component({
    selector: 'app-sf-arrays-objects',
    templateUrl: './signal-form-arrays-objects.component.html',
    imports: [
        FormField, JsonPipe, ColumnDirective,
    ]
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

