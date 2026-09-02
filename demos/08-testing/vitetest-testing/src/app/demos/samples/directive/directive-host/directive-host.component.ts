import { Component } from '@angular/core';
import { DirectiveComponent } from '../directive.component';

@Component({
    selector: 'app-directive-host',
    templateUrl: './directive-host.component.html',
    styleUrls: ['./directive-host.component.scss'],
    imports: [DirectiveComponent]
})
export class DirectiveHostComponent {

}
