import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { UserProfileStore } from './user-profile.store';

@Component({
    selector: 'app-deep-signals',
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatFormField,
        MatLabel,
        MatInput,
        MatButton,
        FormsModule,
    ],
    providers: [UserProfileStore],
    templateUrl: './deep-signals.component.html',
    styleUrl: './deep-signals.component.scss',
})
export class DeepSignalComponent {
    store = inject(UserProfileStore);
}
