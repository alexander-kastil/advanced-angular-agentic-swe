import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterReducerState } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { getRouterInfo } from 'src/app/state/router.selectors';
import { JsonPipe } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-routing-target',
    templateUrl: './routing-target.component.html',
    styleUrls: ['./routing-target.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCard,
        MatCardContent,
        JsonPipe,
    ]
})
export class RoutingTargetComponent {
    store = inject(Store) as Store<RouterReducerState>;
    routerState = toSignal(this.store.select(getRouterInfo).pipe(tap(console.log)));
}