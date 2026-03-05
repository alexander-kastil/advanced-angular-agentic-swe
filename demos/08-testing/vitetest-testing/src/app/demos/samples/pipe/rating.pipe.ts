import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'rating',
  standalone: true,
})
export class RatingPipe implements PipeTransform {
  transform(value: number, args?: any): any {
    let result = '';
    switch (true) {
      case value <= 0:
        throw new Error('Invalid param');
      case value == 1:
        result = 'umwerfend';
        break;
      case value == 2:
        result = 'ausgezeichnet';
        break;
      case value == 3:
        result = 'in ordnung';
        break;
      case value == 4:
        result = 'könnte besser sein';
        break;
      case value == 5:
        result = 'nicht das gelbe vom ei';
        break;
      default:
        throw new Error('Argument out of range');
        break;
    }
    return result;
  }
}
