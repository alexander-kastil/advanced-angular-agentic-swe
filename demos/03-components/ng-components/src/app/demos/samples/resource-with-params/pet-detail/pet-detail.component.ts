import { httpResource } from '@angular/common/http';
import { Component, input } from '@angular/core';
import { environment } from '../../../../../environments/environment';

interface Pet {
  id: number;
  name: string;
  age: number;
  type: string;
  breed: string;
  owner: string;
}

@Component({
  selector: 'app-pet-detail',
  templateUrl: './pet-detail.component.html',
  styleUrl: './pet-detail.component.scss',
})
export class PetDetailComponent {
  readonly petId = input.required<number>();

  readonly pet = httpResource<Pet>(() => `${environment.api}pets/${this.petId()}`);

  reload() {
    this.pet.reload();
  }
}
