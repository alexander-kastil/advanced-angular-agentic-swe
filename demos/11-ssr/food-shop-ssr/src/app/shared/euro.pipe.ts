import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toEuro' })
export class EuroPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) {
      return '0.00 €';
    }
    return `${value.toFixed(2)} €`;
  }
}
