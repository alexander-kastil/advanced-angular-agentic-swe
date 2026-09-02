import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PetLabelService {
  format(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
}
