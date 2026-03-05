import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-binding',
    templateUrl: './binding.component.html',
    styleUrls: ['./binding.component.scss'],
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatSlideToggle,
        FormsModule,
    ],
    host: {
        '[attr.isChecked]': 'checked()'
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingComponent {
    checked = signal(false);
}
