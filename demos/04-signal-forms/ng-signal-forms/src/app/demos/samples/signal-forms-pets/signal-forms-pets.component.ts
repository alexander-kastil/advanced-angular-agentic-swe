import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { form, FormField, required, min, max, submit } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { PetService } from './pet.service';
import { inject } from '@angular/core';
import { Pet, Owner, PetType } from './pet.model';
import { JsonPipe } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';

interface PetFormModel {
    name: string;
    age: number;
    type: PetType;
    breed: string;
    owner: Owner;
}

const emptyPet: PetFormModel = {
    name: '',
    age: NaN,
    type: 'cat',
    breed: '',
    owner: 'Alex',
};

@Component({
    selector: 'app-signal-forms-pets',
    templateUrl: './signal-form-pets.component.html',
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
        MatButton,
        MatSelectModule,
        FormsModule,
        JsonPipe,
        MatProgressBar, ColumnDirective, MatListModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalFormsPetsComponent {
    private petService = inject(PetService);

    pets = computed(() => this.petService.pets() ?? []);
    isLoading = this.petService.isLoading;
    selectedPet = this.petService.selectedPet;

    changeLog = signal<string[]>([]);
    submitted = signal(false);

    petModel = signal<PetFormModel>({ ...emptyPet });

    petForm = form(this.petModel, (s) => {
        required(s.name, { message: 'Pet name is required' });
        required(s.age, { message: 'Age is required' });
        min(s.age, 0, { message: 'Age cannot be negative' });
        max(s.age, 30, { message: 'Age must be 30 or less' });
        required(s.breed, { message: 'Breed is required' });
        required(s.owner, { message: 'Owner is required' });
    });

    pageTitle = computed(() =>
        this.selectedPet() ? `Details: ${this.selectedPet()!.name}` : 'Signal Forms - Pets'
    );

    trackChange = effect(() => {
        const model = this.petModel();
        if (model.name || model.breed || model.owner) {
            const entry = `[${new Date().toLocaleTimeString()}] name=${model.name}, type=${model.type}, breed=${model.breed}, owner=${model.owner}`;
            this.changeLog.update((log) => [entry, ...log].slice(0, 10));
        }
    });

    onSelectPet(pet: Pet): void {
        this.selectedPet.set(pet);
        this.petModel.set({
            name: pet.name,
            age: pet.age,
            type: pet.type,
            breed: pet.breed,
            owner: pet.owner,
        });
        this.submitted.set(false);
    }

    savePet(): void {
        submit(this.petForm, async () => {
            this.submitted.set(true);
            const updated = this.petModel();
            this.selectedPet.set({ ...updated });
            this.petService.reload();
        });
    }

    addPet(): void {
        this.selectedPet.set(undefined);
        this.petModel.set({ ...emptyPet });
        this.submitted.set(false);
        this.changeLog.set([]);
    }

    createPet(): void {
        submit(this.petForm, async () => {
            this.submitted.set(true);
            const newPet = { ...this.petModel() };
            this.selectedPet.set(newPet);
            this.petService.reload();
        });
    }
}

