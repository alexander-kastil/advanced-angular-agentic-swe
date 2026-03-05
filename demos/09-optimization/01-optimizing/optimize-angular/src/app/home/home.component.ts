import { Component } from '@angular/core';
import { IntroComponent } from '../shared/intro/intro.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [IntroComponent]
})
export class HomeComponent {}
