import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'ux-split',
    templateUrl: './ux-split.component.html',
    styleUrls: ['./ux-split.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class uxSplitComponent { }
