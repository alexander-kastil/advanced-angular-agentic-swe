import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { ContainerPresenterSignalsComponent } from './samples/container-presenter/container-presenter-signals.component';
import { DebouncedSearchComponent } from './samples/debounced-search/debounced-search.component';
import { DevtoolsSignalGraphComponent } from './samples/devtools-signal-graph/devtools-signal-graph.component';
import { EffectCleanupComponent } from './samples/effect-cleanup/effect-cleanup.component';
import { HttpResourceComponent } from './samples/http-resource/http-resource.component';
import { LinkedSignalResetComponent } from './samples/linked-signal-reset/linked-signal-reset.component';
import { LinkedSignalSetComponent } from './samples/linked-signal-set/linked-signal-set.component';
import { ModelInputsComponent } from './samples/model-inputs/model-inputs.component';
import { ResourceChainComponent } from './samples/resource-chain/resource-chain.component';
import { RxjsInteropComponent } from './samples/rxjs-interop/rxjs-interop.component';
import { ServiceInjectAsyncComponent } from './samples/service-injectasync/service-injectasync.component';
import { SignalEffectsComponent } from './samples/signal-effects/signal-effects.component';
import { SignalEqualityComponent } from './samples/signal-equality/signal-equality.component';
import { SignalInputsComponent } from './samples/signal-inputs/signal-inputs.component';
import { SignalsBasicsComponent } from './samples/signals-basics/signals-basics.component';

export const demoRoutes: Routes = [
  {
    path: '',
    component: DemoContainerComponent,
    children: [
      { path: 'signals-basics', component: SignalsBasicsComponent },
      { path: 'http-resource', component: HttpResourceComponent },
      { path: 'signal-effects', component: SignalEffectsComponent },
      { path: 'signal-inputs', component: SignalInputsComponent },
      { path: 'signal-equality', component: SignalEqualityComponent },
      { path: 'linked-signal-reset', component: LinkedSignalResetComponent },
      { path: 'linked-signal-set', component: LinkedSignalSetComponent },
      { path: 'effect-cleanup', component: EffectCleanupComponent },
      { path: 'model-inputs', component: ModelInputsComponent },
      { path: 'container-presenter', component: ContainerPresenterSignalsComponent },
      { path: 'rxjs-interop', component: RxjsInteropComponent },
      { path: 'resource-chain', component: ResourceChainComponent },
      { path: 'debounced-search', component: DebouncedSearchComponent },
      { path: 'service-injectasync', component: ServiceInjectAsyncComponent },
      { path: 'devtools-signal-graph', component: DevtoolsSignalGraphComponent },
    ],
  },
];
