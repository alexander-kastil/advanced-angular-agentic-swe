import { Component } from '@angular/core';
import { CodePanelComponent } from '../../../shared/code-panel/code-panel.component';

interface SpecRow {
  file: string;
  covers: string;
}

@Component({
  selector: 'app-karma-to-vitest',
  imports: [CodePanelComponent],
  templateUrl: './karma-to-vitest.component.html',
  styleUrl: './karma-to-vitest.component.scss',
})
export class KarmaToVitestComponent {
  readonly removed = [
    'karma',
    'karma-chrome-launcher',
    'karma-coverage',
    'karma-jasmine',
    'karma-jasmine-html-reporter',
    'jasmine-core',
    '@types/jasmine',
    'istanbul-lib-instrument',
  ];

  readonly added = ['vitest', 'jsdom'];

  readonly specs: SpecRow[] = [
    { file: 'food-list.component.spec.ts', covers: 'httpResource catalog, cart total, offline header' },
    { file: 'food-details.component.spec.ts', covers: 'route param to request URL, missing id branch' },
    { file: 'shop-item.component.spec.ts', covers: 'signal inputs, linkedSignal quantity, output emission' },
    { file: 'number-picker.component.spec.ts', covers: 'linkedSignal seeded from an input, bounds' },
    { file: 'hydration-probe.component.spec.ts', covers: 'click counter and the hydration marker' },
    { file: 'dish-params.component.spec.ts', covers: 'a route param arriving as a signal input' },
  ];

  readonly before = `"test": {
  "builder": "@angular/build:karma",
  "options": {
    "polyfills": ["zone.js", "zone.js/testing"],
    "tsConfig": "tsconfig.spec.json",
    "karmaConfig": "karma.conf.js"
  }
}`;

  readonly after = `"test": {
  "builder": "@angular/build:unit-test",
  "options": {
    "tsConfig": "tsconfig.spec.json",
    "buildTarget": "food-shop-ssr:build",
    "setupFiles": ["src/test-setup.ts"]
  }
}`;

  readonly tsconfig = `{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*.spec.ts", "src/**/*.d.ts"]
}`;

  readonly setup = `import { getPlatform } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

if (!getPlatform()) {
  getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  });
}`;

  readonly spec = `import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DishParamsComponent } from './dish-params.component';

describe('DishParamsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DishParamsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('requests the dish named by the id input', async () => {
    const fixture = TestBed.createComponent(DishParamsComponent);
    fixture.componentRef.setInput('id', '2');
    fixture.detectChanges();

    TestBed.tick();

    const http = TestBed.inject(HttpTestingController);
    http.expectOne('http://localhost:3010/food/2').flush({
      id: 2,
      name: 'Blini with Salmon',
      price: 9,
      inStock: 12,
    });

    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Blini with Salmon');
  });
});`;

  readonly trap = `TestBed.tick();                  // 1. flush the httpResource effect
http.expectOne(url).flush(body); // 2. only now does the request exist
await fixture.whenStable();      // 3. let the resource publish the value
fixture.detectChanges();         // 4. render it

// awaiting whenStable() before tick() deadlocks: the pending
// request keeps the application unstable forever`;
}
