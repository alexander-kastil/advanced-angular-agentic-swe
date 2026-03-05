import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-app-state',
    templateUrl: './app-state.component.html',
    styleUrls: ['./app-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppStateComponent { }
