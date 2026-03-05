import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SimpleCustomersComponent } from './simple-customers/simple-customers.component';

@Component({
    selector: 'app-component-test',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './component-test.component.html',
    styleUrls: ['./component-test.component.scss'],
    imports: [SimpleCustomersComponent]
})
export class ComponentTestComponent {

}
