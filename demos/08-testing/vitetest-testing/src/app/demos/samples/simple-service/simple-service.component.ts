import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-simple-service',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './simple-service.component.html',
    styleUrls: ['./simple-service.component.scss'],
    imports: []
})
export class SimpleServiceComponent {

}
