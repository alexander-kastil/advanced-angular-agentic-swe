import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardActions
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { JsonPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';

interface Pet {
    id: number;
    name: string;
    age: number;
    type: string;
    breed: string;
    owner: string;
}

/**
 * ❌ ANTIPATTERN DEMO ❌
 *
 * This component demonstrates OUTDATED patterns that should NOT be used in modern Angular.
 * Compare with ResourceApiComponent to see why these patterns are problematic.
 *
 * Problems with this approach:
 * 1. Manual state management spread across multiple signals
 * 2. Requires manual reset before each HTTP call
 * 3. Error handling is boilerplate-heavy
 * 4. Must manually coordinate loading state with data fetching
 * 5. Uses BehaviorSubject for local state (unnecessary RxJS complexity)
 * 6. Hard to test - not reactive
 */
@Component({
    selector: 'app-antipatterns',
    templateUrl: './antipatterns.component.html',
    styleUrl: './antipatterns.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatCardTitle,
        MatCardActions,
        MatButton,
        MatProgressSpinner,
        JsonPipe,
        BoxedDirective
    ]
})
export class AntipatternsComponent {
    private http = inject(HttpClient);

    // 🚫 PROBLEM: Using manual state signals instead of resource()
    protected petId = signal(1);
    protected pet = signal<Pet | undefined>(undefined);
    protected isLoading = signal(false);
    protected error = signal<string | undefined>(undefined);

    // 🚫 PROBLEM: Using BehaviorSubject for local state (unnecessary RxJS)
    private petSubject$ = new BehaviorSubject<Pet | undefined>(undefined);

    protected loadPet(id: number) {
        // 🚫 PROBLEM: Must manually reset state before loading
        this.isLoading.set(true);
        this.error.set(undefined);

        // 🚫 PROBLEM: Verbose subscription syntax with manual subscription management
        this.http.get<Pet>(`/api/pets/${id}`).subscribe({
            next: (data) => {
                this.pet.set(data);
                this.isLoading.set(false);
                this.petSubject$.next(data);
            },
            error: (err) => {
                // 🚫 PROBLEM: Manual error handling and state coordination
                this.error.set(err.message || 'Failed to load pet');
                this.isLoading.set(false);
            }
        });
    }

    protected loadNext() {
        // 🚫 PROBLEM: Must manually coordinate multiple pieces of state
        const newId = this.petId() + 1;
        this.petId.set(newId);
        this.loadPet(newId);
    }

    protected loadPrevious() {
        // 🚫 PROBLEM: Must manually coordinate multiple pieces of state
        const newId = Math.max(1, this.petId() - 1);
        this.petId.set(newId);
        this.loadPet(newId);
    }

    protected reload() {
        // 🚫 PROBLEM: Must manually trigger load function
        this.loadPet(this.petId());
    }
}

