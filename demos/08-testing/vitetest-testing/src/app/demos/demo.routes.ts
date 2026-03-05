import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { AsyncComponent } from './samples/component-async/async.component';
import { ComponentClassComponent } from './samples/component-class/component-class.component';
import { ComponentEventsComponent } from './samples/component-events/component-events.component';
import { ComponentInputSignalsComponent } from './samples/component-input-signals/component-input-signals.component';
import { IntegrationTestComponent } from './samples/component-integration/integration-test.component';
import { MaterialAsyncComponent } from './samples/component-material-async/material-async.component';
import { MaterialComponent } from './samples/component-material/material.component';
import { SpyHostComponent } from './samples/component-mocking/spy-host/spy-host.component';
import { ComponentTestComponent } from './samples/component-test/component-test.component';
import { ComponentWriteComponent } from './samples/component-write/component-write.component';
import { DirectiveHostComponent } from './samples/directive/directive-host/directive-host.component';
import { HttpTestsSignalComponent } from './samples/http-tests-signal/http-tests-signal.component';
import { HttpTestsComponent } from './samples/http-tests/http-tests.component';
import { UnitTestingComponent } from './samples/intro-unit-testing/unit-testing.component';
import { TestPipeComponent } from './samples/pipe/test-pipe.component';
import { SimpleServiceComponent } from './samples/simple-service/simple-service.component';
import { MockSignalsStoreComponent } from './samples/mock-signals-store/mock-signals-store.component';
import { TestSignalsStoreComponent } from './samples/test-signals-store/test-signals-store.component';
import { PlaywrightComponent } from './samples/playwright/playwright.component';

export const demoRoutes: Routes = [
    {
        path: '',
        component: DemoContainerComponent,
        children: [
            { path: 'testing-intro', component: UnitTestingComponent },
            { path: 'component-events', component: ComponentEventsComponent },
            { path: 'component-write', component: ComponentWriteComponent },
            { path: 'component-input-signals', component: ComponentInputSignalsComponent },
            { path: 'pipe', component: TestPipeComponent },
            { path: 'directive', component: DirectiveHostComponent },
            { path: 'simple-service', component: SimpleServiceComponent },
            { path: 'component-test', component: ComponentTestComponent },
            { path: 'integration-tests', component: IntegrationTestComponent },
            { path: 'http-tests', component: HttpTestsComponent },
            { path: 'http-tests-signal', component: HttpTestsSignalComponent },
            { path: 'async', component: AsyncComponent },
            { path: 'material-async', component: MaterialAsyncComponent },
            { path: 'material', component: MaterialComponent },
            { path: 'component-class', component: ComponentClassComponent },
            { path: 'spy', component: SpyHostComponent },
            { path: 'mock-signals-store', component: MockSignalsStoreComponent },
            { path: 'test-signals-store', component: TestSignalsStoreComponent },
            { path: 'playwright', component: PlaywrightComponent },
        ],
    }
];