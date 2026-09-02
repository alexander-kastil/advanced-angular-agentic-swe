import { Component, signal } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';
import { PetBadgeComponent } from './pet-badge/pet-badge.component';
import {
  legacyComponentSource,
  legacyTemplateSource,
  modernComponentSource,
  modernTemplateSource,
} from './refactor-sources';

interface RefactorStep {
  legacy: string;
  modern: string;
  driver: string;
}

@Component({
  selector: 'app-agentic-refactor',
  templateUrl: './agentic-refactor.component.html',
  styleUrl: './agentic-refactor.component.scss',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, BoxedDirective, PetBadgeComponent],
})
export class AgenticRefactorComponent {
  readonly legacyComponent = legacyComponentSource;
  readonly legacyTemplate = legacyTemplateSource;
  readonly modernComponent = modernComponentSource;
  readonly modernTemplate = modernTemplateSource;

  readonly lastSelected = signal('nothing yet');

  readonly steps: RefactorStep[] = [
    {
      legacy: '@Input() name: string',
      modern: 'name = input.required<string>()',
      driver: 'ng generate @angular/core:signal-input-migration',
    },
    {
      legacy: '@Output() selected = new EventEmitter()',
      modern: 'selected = output<string>()',
      driver: 'ng generate @angular/core:output-migration',
    },
    {
      legacy: 'constructor(private labels: PetLabelService)',
      modern: 'private readonly labels = inject(PetLabelService)',
      driver: 'ng generate @angular/core:inject-migration',
    },
    {
      legacy: '@HostBinding / @HostListener',
      modern: 'host: {} object in the component metadata',
      driver: 'agent edit, verified against get_best_practices',
    },
    {
      legacy: '*ngIf with an else ng-template',
      modern: '@if / @else block',
      driver: 'ng generate @angular/core:control-flow',
    },
    {
      legacy: 'ngOnInit assigns a derived field',
      modern: 'computed() derives it',
      driver: 'agent edit, no schematic exists',
    },
    {
      legacy: 'changeDetection: OnPush written by hand',
      modern: 'deleted, OnPush is the Angular 22 default',
      driver: 'agent edit across the whole module',
    },
  ];

  select(name: string) {
    this.lastSelected.set(name);
  }
}
