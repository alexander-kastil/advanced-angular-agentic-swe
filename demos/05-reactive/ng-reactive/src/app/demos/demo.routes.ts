import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { ActionStreamsComponent } from './samples/action-streams/action-streams.component';
import { AsyncPipeComponent } from './samples/async-pipe/async-pipe.component';
import { CombiningComponent } from './samples/combining/combining.component';
import { CreatingObservableComponent } from './samples/creating-observables/creating-observable.component';
import { CustomOperatorsComponent } from './samples/custom-operators/custom-operators.component';
import { DebouncedSearchComponent } from './samples/debounced-search/debounced-search.component';
import { DeclarativeComponent } from './samples/declarative/declarative.component';
import { ErrHandlingComponent } from './samples/err-handling/err-handling.component';
import { HttpresourcePatternComponent } from './samples/httpresource-pattern/httpresource-pattern.component';
import { HttpWithRxjsComponent } from './samples/http-with-rxjs/http-with-rxjs.component';
import { ImperativeComponent } from './samples/imperative/imperative.component';
import { MouseDomObservablesComponent } from './samples/mouse-dom-observables/mouse-dom-observables.component';
import { ObservableToSignalComponent } from './samples/observable-to-signal/observable-to-signal.component';
import { OperatorsComponent } from './samples/operators/operators.component';
import { ResponsiveScreenComponent } from './samples/responsive-screen/responsive-screen.component';
import { RequestStatusPatternComponent } from './samples/request-status-pattern/request-status-pattern.component';
import { SubjectToOutputComponent } from './samples/subject-to-output/subject-to-output.component';
import { SubjectsComponent } from './samples/subjects/subjects.component';
import { TimerIntervalComponent } from './samples/timer-interval/timer-interval.component';
import { TransformationComponent } from './samples/transformation/transformation.component';

export const demoRoutes: Routes = [
    {
        path: '',
        component: DemoContainerComponent,
        children: [
            { path: 'imperative', component: ImperativeComponent },
            { path: 'reactive', component: DeclarativeComponent },
            { path: 'async-pipe', component: AsyncPipeComponent },
            { path: 'subjects', component: SubjectsComponent },
            { path: 'creating', component: CreatingObservableComponent },
            { path: 'operators', component: OperatorsComponent },
            { path: 'transformation', component: TransformationComponent },
            { path: 'combining', component: CombiningComponent },
            { path: 'err-handling', component: ErrHandlingComponent },
            { path: 'custom-operators', component: CustomOperatorsComponent },
            { path: 'timer-interval', component: TimerIntervalComponent },
            { path: 'action-streams', component: ActionStreamsComponent },
            { path: 'debounced', component: DebouncedSearchComponent },
            { path: 'mouse-dom', component: MouseDomObservablesComponent },
            { path: 'responsive-screen', component: ResponsiveScreenComponent },
            { path: 'http-with-rxjs', component: HttpWithRxjsComponent },
            { path: 'observable-to-signal', component: ObservableToSignalComponent },
            { path: 'httpresource-pattern', component: HttpresourcePatternComponent },
            { path: 'subject-to-output', component: SubjectToOutputComponent },
            { path: 'request-status-pattern', component: RequestStatusPatternComponent },
        ],
    },
];