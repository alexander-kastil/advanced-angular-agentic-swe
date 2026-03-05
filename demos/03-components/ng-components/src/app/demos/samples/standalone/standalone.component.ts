
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-standalone',
    templateUrl: './standalone.component.html',
    styleUrls: ['./standalone.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandaloneComponent { }

