import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  quote(symbol: string): number {
    const base = [...symbol].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return Math.round(((base % 380) + 20 + Math.random() * 40) * 100) / 100;
  }
}
