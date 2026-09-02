import {Component } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-prime',
    templateUrl: './prime.component.html',
    styleUrls: ['./prime.component.scss'],
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent]
})
export class PrimeComponent {

}
