import { Injectable, signal, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Pet } from './pet.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PetService {
    private petsResource = httpResource<Pet[]>(() => `${environment.api}pets`);
    readonly pets = this.petsResource.value;
    readonly isLoading = this.petsResource.isLoading;
    readonly selectedPet = signal<Pet | undefined>(undefined);

    readonly petsByOwner = computed(() => {
        const grouped = new Map<string, Pet[]>();
        for (const pet of this.pets() ?? []) {
            const list = grouped.get(pet.owner) ?? [];
            list.push(pet);
            grouped.set(pet.owner, list);
        }
        return grouped;
    });

    reload(): void {
        this.petsResource.reload();
    }
}
