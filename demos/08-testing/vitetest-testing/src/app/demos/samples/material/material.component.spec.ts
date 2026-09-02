import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach } from 'vitest';
import { MaterialComponent } from './material.component';
// Notice manual import of ...Harness
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { MarkdownModule } from 'ngx-markdown';
import { provideHttpClient } from '@angular/common/http';

describe('MaterialComponent', () => {
  let fixture: ComponentFixture<MaterialComponent>;
  let loader: HarnessLoader;
  let sliderHarness: MatSliderHarness;
  let btnResetHarness: MatButtonHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MarkdownModule.forRoot()
      ],
      providers: [
        provideHttpClient()
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(MaterialComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should btnReset the slider when btnReset is clicked', async () => {
    btnResetHarness = await loader.getHarness(
      MatButtonHarness.with({ text: 'Reset' })
    );
    sliderHarness = await loader.getHarness(MatSliderHarness);
    await btnResetHarness.click();
    const thumb = await sliderHarness.getEndThumb();
    expect(await thumb.getValue()).toBe(1);
  });

  it('should have the correct value in the input', async () => {
    const input = await loader.getHarness(MatInputHarness);
    expect(await input.getValue()).toBe('Sushi');
    await input.setValue('Pizza');
    expect(await input.getValue()).toBe('Pizza');
  });
});
