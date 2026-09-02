import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { CombiningComponent } from './samples/combining/combining.component';
import { DebounceThreeWaysComponent } from './samples/debounce-three-ways/debounce-three-ways.component';
import { ErrorHandlingComponent } from './samples/error-handling/error-handling.component';
import { FlatteningStrategiesComponent } from './samples/flattening-strategies/flattening-strategies.component';
import { InteropComponent } from './samples/interop/interop.component';
import { RxjsToSignalsMigrationComponent } from './samples/rxjs-to-signals-migration/rxjs-to-signals-migration.component';
import { RxresourceVsSwitchmapComponent } from './samples/rxresource-vs-switchmap/rxresource-vs-switchmap.component';
import { SubscribeVsStreamVsSignalComponent } from './samples/subscribe-vs-stream-vs-signal/subscribe-vs-stream-vs-signal.component';

export const demoRoutes: Routes = [
    {
        path: '',
        component: DemoContainerComponent,
        children: [
            { path: 'subscribe-vs-stream-vs-signal', component: SubscribeVsStreamVsSignalComponent },
            { path: 'flattening-strategies', component: FlatteningStrategiesComponent },
            { path: 'combining', component: CombiningComponent },
            { path: 'error-handling', component: ErrorHandlingComponent },
            { path: 'interop', component: InteropComponent },
            { path: 'debounce-three-ways', component: DebounceThreeWaysComponent },
            { path: 'rxresource-vs-switchmap', component: RxresourceVsSwitchmapComponent },
            { path: 'rxjs-to-signals-migration', component: RxjsToSignalsMigrationComponent },
        ],
    },
];
