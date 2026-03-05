import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProjectorComponent } from './projector/projector.component';

@Component({
    selector: 'app-content-child',
    templateUrl: './content-child.component.html',
    styleUrls: ['./content-child.component.scss'],
    imports: [ProjectorComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentChildComponent {
}
