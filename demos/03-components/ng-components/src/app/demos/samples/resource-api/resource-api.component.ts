import {
    ChangeDetectionStrategy,
    Component,
    inject,
    resource,
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
import { firstValueFrom } from 'rxjs';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';

interface Pet {
    id: number;
    name: string;
    age: number;
    type: string;
    breed: string;
    owner: string;
}

@Component({
    selector: 'app-resource-api',
    templateUrl: './resource-api.component.html',
    styleUrl: './resource-api.component.scss',
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
export class ResourceApiComponent {
    private http = inject(HttpClient);
    protected petId = signal(1);

    protected petResource = resource({
        loader: async () => {
            return await firstValueFrom(
                this.http.get<Pet>(`/api/pets/${this.petId()}`)
            );
        }
    });

    protected loadNext() {
        this.petId.update(id => id + 1);
        this.petResource.reload();
    }

    protected loadPrevious() {
        this.petId.update(id => Math.max(1, id - 1));
        this.petResource.reload();
    }

    protected reload() {
        this.petResource.reload();
    }
}
