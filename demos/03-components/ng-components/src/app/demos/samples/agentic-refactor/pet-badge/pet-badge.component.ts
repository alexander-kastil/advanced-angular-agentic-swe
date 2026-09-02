import { Component, computed, inject, input, output } from '@angular/core';
import { PetLabelService } from '../pet-label.service';

@Component({
  selector: 'app-pet-badge',
  templateUrl: './pet-badge.component.html',
  styleUrl: './pet-badge.component.scss',
  host: {
    tabindex: '0',
    '[class.adopted]': 'adopted()',
    '(click)': 'selected.emit(name())',
    '(keydown.enter)': 'selected.emit(name())',
  },
})
export class PetBadgeComponent {
  private readonly labels = inject(PetLabelService);

  readonly name = input.required<string>();
  readonly adopted = input(false);

  readonly selected = output<string>();

  readonly label = computed(() => this.labels.format(this.name()));
}
