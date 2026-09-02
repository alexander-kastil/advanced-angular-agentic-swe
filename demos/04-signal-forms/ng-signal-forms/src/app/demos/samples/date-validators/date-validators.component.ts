import { DatePipe, JsonPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormField, form, maxDate, minDate, required, validate } from '@angular/forms/signals';
import { BoxedDirective, ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';

interface TripModel {
  departure: Date | null;
  arrival: Date | null;
}

function atMidnight(offsetDays: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return date;
}

const BOOKING_OPENS = atMidnight(0);
const BOOKING_CLOSES = atMidnight(180);

@Component({
  selector: 'app-date-validators',
  templateUrl: './date-validators.component.html',
  styleUrls: ['./date-validators.component.scss'],
  imports: [
    FormField,
    BoxedDirective, ColumnDirective, DatePipe, JsonPipe,
  ],
})
export class DateValidatorsComponent {
  readonly opens = BOOKING_OPENS;
  readonly closes = BOOKING_CLOSES;

  readonly model = signal<TripModel>({ departure: null, arrival: null });

  readonly tripForm = form(this.model, (s) => {
    required(s.departure, { message: 'Pick a departure date' });
    minDate(s.departure, BOOKING_OPENS, { message: 'Bookings do not open before today' });
    maxDate(s.departure, BOOKING_CLOSES, { message: 'Bookings close 180 days out' });

    required(s.arrival, { message: 'Pick an arrival date' });
    minDate(s.arrival, ({ valueOf }) => valueOf(s.departure) ?? undefined, {
      message: 'Arrival cannot be before departure',
    });
    maxDate(s.arrival, BOOKING_CLOSES, { message: 'Bookings close 180 days out' });

    validate(s.arrival, ({ value, valueOf }) => {
      const arrival = value();
      const departure = valueOf(s.departure);
      if (!arrival || !departure) {
        return null;
      }
      const nights = Math.round((arrival.getTime() - departure.getTime()) / 86_400_000);
      return nights > 30 ? { kind: 'tooLong', message: 'Trips are capped at 30 nights' } : null;
    });
  });

  readonly departureMinError = computed(() => this.tripForm.departure().getError('minDate'));
  readonly departureMaxError = computed(() => this.tripForm.departure().getError('maxDate'));
  readonly arrivalMinError = computed(() => this.tripForm.arrival().getError('minDate'));
  readonly arrivalTooLong = computed(() => this.tripForm.arrival().getError('tooLong'));

  loadValidTrip(): void {
    this.model.set({ departure: atMidnight(7), arrival: atMidnight(14) });
  }

  loadTooEarly(): void {
    this.model.set({ departure: atMidnight(-3), arrival: atMidnight(5) });
    this.tripForm().markAsTouched();
  }

  loadTooLong(): void {
    this.model.set({ departure: atMidnight(10), arrival: atMidnight(60) });
    this.tripForm().markAsTouched();
  }

  clear(): void {
    this.model.set({ departure: null, arrival: null });
    this.tripForm().reset();
  }
}
