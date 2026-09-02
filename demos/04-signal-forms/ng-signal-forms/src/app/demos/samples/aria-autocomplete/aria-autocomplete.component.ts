import { JsonPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Combobox, ComboboxPopup, ComboboxWidget } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { FormField, form, required, validate } from '@angular/forms/signals';
import { BoxedDirective, ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';

const AIRPORTS = [
  'Vienna VIE',
  'Salzburg SZG',
  'Graz GRZ',
  'Innsbruck INN',
  'Munich MUC',
  'Zurich ZRH',
  'Berlin BER',
  'Hamburg HAM',
  'Amsterdam AMS',
  'Barcelona BCN',
];

interface FlightModel {
  passenger: string;
  origin: string;
}

@Component({
  selector: 'app-aria-autocomplete',
  templateUrl: './aria-autocomplete.component.html',
  styleUrls: ['./aria-autocomplete.component.scss'],
  imports: [
    FormField,
    Combobox, ComboboxPopup, ComboboxWidget, Listbox, Option,
    BoxedDirective, ColumnDirective, JsonPipe,
  ],
})
export class AriaAutocompleteComponent {
  readonly airports = AIRPORTS;
  readonly expanded = signal(false);

  readonly model = signal<FlightModel>({ passenger: '', origin: '' });

  readonly flightForm = form(this.model, (s) => {
    required(s.passenger, { message: 'Passenger name is required' });
    required(s.origin, { message: 'Pick a departure airport' });
    validate(s.origin, ({ value }) =>
      value() !== '' && !AIRPORTS.includes(value())
        ? { kind: 'unknownAirport', message: 'Pick one of the listed airports' }
        : null,
    );
  });

  readonly originField = this.flightForm.origin;

  readonly filtered = computed(() => {
    const query = this.originField().value().trim().toLowerCase();
    return query === '' ? this.airports : this.airports.filter((a) => a.toLowerCase().includes(query));
  });

  readonly selection = computed(() => (this.airports.includes(this.originField().value()) ? [this.originField().value()] : []));

  onQuery(value: string): void {
    this.originField().value.set(value);
  }

  onPick(values: readonly string[]): void {
    const picked = values[0];
    if (picked) {
      this.originField().value.set(picked);
      this.expanded.set(false);
    }
  }

  clear(): void {
    this.model.set({ passenger: '', origin: '' });
    this.flightForm().reset();
  }
}
