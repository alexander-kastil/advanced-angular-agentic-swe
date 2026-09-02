import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-intro',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.scss'],
    imports: [RouterLink],
})
export class IntroComponent {
    readonly title = input('');
    readonly subtitle = input('');
    readonly img = input('');
}
