import { Component, signal } from '@angular/core';
import { SlideToggleComponent } from '../../../../shared/slide-toggle/slide-toggle.component';

@Component({
    selector: 'app-binding',
    templateUrl: './binding.component.html',
    styleUrls: ['./binding.component.scss'],
    imports: [SlideToggleComponent],
    host: {
        '[attr.isChecked]': 'checked()'
    },
})
export class BindingComponent {
    checked = signal(false);
}
