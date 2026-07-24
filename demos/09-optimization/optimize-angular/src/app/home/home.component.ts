import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IntroComponent } from '../shared/intro/intro.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [IntroComponent]
})
export class HomeComponent {}
