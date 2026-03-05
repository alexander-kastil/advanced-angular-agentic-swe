import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IntroComponent } from '../shared/intro/intro.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [IntroComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent { }
