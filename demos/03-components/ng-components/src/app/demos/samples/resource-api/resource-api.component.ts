import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';

interface Pet {
  id: number;
  name: string;
  age: number;
  type: string;
  breed: string;
  owner: string;
}

@Component({
  selector: 'app-resource-api',
  templateUrl: './resource-api.component.html',
  styleUrl: './resource-api.component.scss',
  imports: [BoxedDirective, ProgressBarComponent],
})
export class ResourceApiComponent {
  protected readonly petId = signal(1);

  protected readonly pet = httpResource<Pet>(() => `${environment.api}pets/${this.petId()}`);

  protected loadNext() {
    this.petId.update((id) => id + 1);
  }

  protected loadPrevious() {
    this.petId.update((id) => Math.max(1, id - 1));
  }

  protected reload() {
    this.pet.reload();
  }
}
