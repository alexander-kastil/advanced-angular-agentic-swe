import { Component, resource, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { environment } from '../../../../environments/environment';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';
import { PetDetailComponent } from './pet-detail/pet-detail.component';

interface Pet {
  id: number;
  name: string;
  age: number;
  type: string;
  breed: string;
  owner: string;
}

@Component({
  selector: 'app-resource-with-params',
  templateUrl: './resource-with-params.component.html',
  styleUrl: './resource-with-params.component.scss',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButton,
    MatButtonToggle,
    MatButtonToggleGroup,
    BoxedDirective,
    PetDetailComponent,
  ],
})
export class ResourceWithParamsComponent {
  readonly petId = signal(1);
  readonly owner = signal('Alex');

  readonly pets = resource<Pet[], { owner: string }>({
    params: () => ({ owner: this.owner() }),
    loader: async ({ params, abortSignal }) => {
      const response = await fetch(`${environment.api}pets?owner=${params.owner}`, {
        signal: abortSignal,
      });
      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }
      return (await response.json()) as Pet[];
    },
    defaultValue: [],
  });

  next() {
    this.petId.update((id) => (id === 8 ? 1 : id + 1));
  }

  previous() {
    this.petId.update((id) => (id === 1 ? 8 : id - 1));
  }

  reloadList() {
    this.pets.reload();
  }
}
