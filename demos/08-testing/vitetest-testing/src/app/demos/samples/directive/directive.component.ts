import { Component } from '@angular/core';
import { CapitalizeDirective } from './capitalize.directive';

@Component({
    selector: 'app-directive',
    templateUrl: './directive.component.html',
    styleUrls: ['./directive.component.scss'],
    imports: [
        CapitalizeDirective
    ]
})
export class DirectiveComponent {

}
