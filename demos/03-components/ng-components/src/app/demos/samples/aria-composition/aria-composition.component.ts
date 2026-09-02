import { Component, computed, signal } from '@angular/core';
import { Listbox, Option } from '@angular/aria/listbox';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';

interface Breed {
  id: string;
  name: string;
  group: string;
  disabled: boolean;
}

@Component({
  selector: 'app-aria-composition',
  templateUrl: './aria-composition.component.html',
  styleUrl: './aria-composition.component.scss',
  imports: [
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabContent,
    Listbox,
    Option,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    BoxedDirective,
  ],
})
export class AriaCompositionComponent {
  readonly selectedTab = signal('sighthounds');

  readonly breeds = signal<Breed[]>([
    { id: 'whippet', name: 'Whippet', group: 'sighthounds', disabled: false },
    { id: 'greyhound', name: 'Greyhound', group: 'sighthounds', disabled: false },
    { id: 'saluki', name: 'Saluki', group: 'sighthounds', disabled: false },
    { id: 'galgo', name: 'Galgo Espanol', group: 'sighthounds', disabled: true },
    { id: 'siamese', name: 'Siamese', group: 'cats', disabled: false },
    { id: 'bengal', name: 'Bengal', group: 'cats', disabled: false },
    { id: 'persian', name: 'Persian', group: 'cats', disabled: false },
  ]);

  readonly picked = signal<string[]>(['whippet']);

  readonly pickedNames = computed(() => {
    const byId = new Map(this.breeds().map((breed) => [breed.id, breed.name]));
    return this.picked().map((id) => byId.get(id) ?? id);
  });

  readonly sighthounds = computed(() =>
    this.breeds().filter((breed) => breed.group === 'sighthounds'),
  );

  readonly cats = computed(() => this.breeds().filter((breed) => breed.group === 'cats'));
}
