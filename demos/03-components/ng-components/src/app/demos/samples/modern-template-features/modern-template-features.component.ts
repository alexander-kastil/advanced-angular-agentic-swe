import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

@Component({
    selector: 'app-modern-template-features',
    templateUrl: './modern-template-features.component.html',
    styleUrls: ['./modern-template-features.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, DecimalPipe],
})
export class ModernTemplateFeaturesComponent {
    // Signals for counter and items
    readonly count = signal(0);
    readonly multiplier = signal(2);
    readonly products = signal<Product[]>([
        { id: 1, name: 'Laptop', price: 1200, quantity: 2 },
        { id: 2, name: 'Mouse', price: 25, quantity: 5 },
        { id: 3, name: 'Keyboard', price: 75, quantity: 3 },
    ]);

    readonly doubled = computed(() => this.count() * this.multiplier());
    readonly totalPrice = computed(() =>
        this.products().reduce((sum, p) => sum + p.price * p.quantity, 0)
    );

    // Event handlers that return values for template arrow functions
    addOne = (value: number) => value + 1;
    multiply = (value: number, by: number) => value * by;
    applyDiscount = (items: Product[], percent: number) =>
        items.map(p => ({ ...p, price: p.price * (1 - percent / 100) }));
}
