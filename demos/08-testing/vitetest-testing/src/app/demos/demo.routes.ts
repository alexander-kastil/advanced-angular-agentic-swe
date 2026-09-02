import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { AiGeneratedTestComponent } from './samples/ai-generated-test/ai-generated-test.component';
import { AiWritesTheTestComponent } from './samples/ai-writes-the-test/ai-writes-the-test.component';
import { BrowserModeHarnessesComponent } from './samples/browser-mode-harnesses/browser-mode-harnesses.component';
import { ComponentInputSignalsComponent } from './samples/component-input-signals/component-input-signals.component';
import { IntegrationTestComponent } from './samples/integration-tests/integration-test.component';
import { MaterialComponent } from './samples/material/material.component';
import { SpyHostComponent } from './samples/spy/spy-host/spy-host.component';
import { ComponentTestComponent } from './samples/component-test/component-test.component';
import { ComponentWriteComponent } from './samples/component-write/component-write.component';
import { DirectiveHostComponent } from './samples/directive/directive-host/directive-host.component';
import { HttpTestsSignalComponent } from './samples/http-tests-signal/http-tests-signal.component';
import { HttpErrorTestsComponent } from './samples/http-error-tests/http-error-tests.component';
import { HttpTestsComponent } from './samples/http-tests/http-tests.component';
import { PlaywrightComponent } from './samples/playwright/playwright.component';
import { TestSignalsStoreComponent } from './samples/test-signals-store/test-signals-store.component';
import { SignalFormsTestingComponent } from './samples/signal-forms-testing/signal-forms-testing.component';
import { TestingFoundationsComponent } from './samples/testing-foundations/testing-foundations.component';
import { WebmcpE2eComponent } from './samples/webmcp-e2e/webmcp-e2e.component';
import { ZonelessAsyncComponent } from './samples/zoneless-async/zoneless-async.component';

export const demoRoutes: Routes = [
    {
        path: '',
        component: DemoContainerComponent,
        children: [
            { path: 'testing-foundations', component: TestingFoundationsComponent },
            { path: 'directive', component: DirectiveHostComponent },
            { path: 'http-tests', component: HttpTestsComponent },
            { path: 'http-tests-signal', component: HttpTestsSignalComponent },
            { path: 'http-error-tests', component: HttpErrorTestsComponent },
            { path: 'component-write', component: ComponentWriteComponent },
            { path: 'component-input-signals', component: ComponentInputSignalsComponent },
            { path: 'component-test', component: ComponentTestComponent },
            { path: 'material', component: MaterialComponent },
            { path: 'browser-mode-harnesses', component: BrowserModeHarnessesComponent },
            { path: 'spy', component: SpyHostComponent },
            { path: 'signal-forms-testing', component: SignalFormsTestingComponent },
            { path: 'zoneless-async', component: ZonelessAsyncComponent },
            { path: 'integration-tests', component: IntegrationTestComponent },
            { path: 'test-signals-store', component: TestSignalsStoreComponent },
            { path: 'playwright', component: PlaywrightComponent },
            { path: 'webmcp-e2e', component: WebmcpE2eComponent },
            { path: 'ai-generated-test', component: AiGeneratedTestComponent },
            { path: 'ai-writes-the-test', component: AiWritesTheTestComponent },
        ],
    }
];
