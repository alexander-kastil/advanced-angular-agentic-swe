import {Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

// ambient declaration for window
declare var window: Window;

@Component({
    selector: 'app-err-page',
    templateUrl: './err-page.component.html',
    styleUrls: ['./err-page.component.scss'],
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        JsonPipe,
    ]
})
export class ErrPageComponent {
    error = window.history.state;
}
