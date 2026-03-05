import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { UserProfileStore } from './user-profile.store';

@Component({
    selector: 'app-deep-signal',
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
    ],
    providers: [UserProfileStore],
    templateUrl: './deep-signal.component.html',
    styleUrl: './deep-signal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeepSignalComponent {
    store = inject(UserProfileStore);
}
