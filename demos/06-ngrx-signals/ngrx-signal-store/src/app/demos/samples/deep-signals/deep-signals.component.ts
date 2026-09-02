import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserProfileStore } from './user-profile.store';

@Component({
    selector: 'app-deep-signals',
    imports: [FormsModule],
    providers: [UserProfileStore],
    templateUrl: './deep-signals.component.html',
    styleUrl: './deep-signals.component.scss',
})
export class DeepSignalComponent {
    store = inject(UserProfileStore);
}
