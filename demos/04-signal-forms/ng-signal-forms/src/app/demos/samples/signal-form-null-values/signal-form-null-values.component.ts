import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { applyWhenValue, form, FormField, min, minLength, required } from '@angular/forms/signals';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';

interface PetDomain {
  petName: string;
  breed: string;
  notes: string | null;
  weight: number | null;
  microchipId?: string;
  adoptionDate: Date | null;
}

interface PetFormModel {
  petName: string;
  breed: string;
  notes: string;
  weight: number;
  microchipId: string;
  adoptionDate: Date | null;
}

const initialData: PetFormModel = {
  petName: '',
  breed: '',
  notes: '',
  weight: 0,
  microchipId: '',
  adoptionDate: null,
};

@Component({
  selector: 'app-sf-null-values',
  templateUrl: './signal-form-null-values.component.html',
  imports: [
    FormField,
    JsonPipe, ColumnDirective,
  ]
})
export class SfNullValuesComponent {
  petModel = signal<PetFormModel>(initialData);

  petForm = form(this.petModel, (s) => {
    required(s.petName, { message: 'Pet name is required' });
    required(s.breed, { message: 'Breed is required' });
    min(s.weight, 0, { message: 'Weight cannot be negative' });

    applyWhenValue(
      s.notes,
      (value) => value !== null && value !== '',
      (notesPath) => minLength(notesPath, 5, { message: 'Notes must be at least 5 characters' })
    );

    applyWhenValue(
      s.microchipId,
      (value) => value !== '',
      (chipPath) => minLength(chipPath, 10, { message: 'Microchip ID must be at least 10 characters' })
    );
  });

  toDomain(): PetDomain {
    const m = this.petModel();
    return {
      petName: m.petName,
      breed: m.breed,
      notes: m.notes === '' ? null : m.notes,
      weight: Number.isNaN(m.weight) ? null : m.weight,
      microchipId: m.microchipId === '' ? undefined : m.microchipId,
      adoptionDate: m.adoptionDate,
    };
  }

  domain = signal<PetDomain | null>(null);

  save(): void {
    this.domain.set(this.toDomain());
  }

  reset(): void {
    this.petForm().reset(initialData);
    this.domain.set(null);
  }
}
