import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { CapitalizeDirective } from './capitalize.directive';

@Component({
    selector: 'app-directive',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './directive.component.html',
    styleUrls: ['./directive.component.scss'],
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        CapitalizeDirective
    ]
})
export class DirectiveComponent {

}
