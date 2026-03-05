import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phonenumber',
  standalone: true,
})
export class PhonenumberPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value === undefined || value === null) {
      throw new Error('No input provided to phone pipe');
    }
    if (value.length === 10) {
      return (
        `(${value.substring(0, 3)}) ${value.substring(3, 6)} ${value.substring(6)}`
      );
    } else {
      return value;
    }
  }
}
