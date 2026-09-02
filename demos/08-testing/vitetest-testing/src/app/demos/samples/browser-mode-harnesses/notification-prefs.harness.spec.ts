import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationPrefsComponent } from './notification-prefs.component';

describe('Browser Mode Harnesses - NotificationPrefsComponent', () => {
  let fixture: ComponentFixture<NotificationPrefsComponent>;
  let component: NotificationPrefsComponent;
  let loader: HarnessLoader;
  let rootLoader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationPrefsComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationPrefsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('starts with the toggle off', async () => {
    const toggle = await loader.getHarness(MatSlideToggleHarness);

    expect(await toggle.isChecked()).toBe(false);
  });

  it('keeps both channel checkboxes disabled while notifications are off', async () => {
    const checkboxes = await loader.getAllHarnesses(MatCheckboxHarness);

    expect(checkboxes.length).toBe(2);
    expect(await checkboxes[0].isDisabled()).toBe(true);
    expect(await checkboxes[1].isDisabled()).toBe(true);
  });

  it('enables the channels once the toggle is switched on', async () => {
    const toggle = await loader.getHarness(MatSlideToggleHarness);
    await toggle.check();

    const email = await loader.getHarness(MatCheckboxHarness.with({ label: 'Email' }));
    expect(await email.isDisabled()).toBe(false);
  });

  it('reports the picked channels in the summary', async () => {
    await (await loader.getHarness(MatSlideToggleHarness)).check();
    await (await loader.getHarness(MatCheckboxHarness.with({ label: 'Email' }))).check();
    await (await loader.getHarness(MatCheckboxHarness.with({ label: 'SMS' }))).check();

    expect(component.summary()).toBe('email and sms daily');
  });

  it('reads the select through its harness', async () => {
    await (await loader.getHarness(MatSlideToggleHarness)).check();
    const select = await loader.getHarness(MatSelectHarness);

    expect(await select.getValueText()).toBe('daily');
  });

  it('picks a frequency from the overlay the select opens', async () => {
    await (await loader.getHarness(MatSlideToggleHarness)).check();
    const select = await loader.getHarness(MatSelectHarness);

    await select.open();
    const options = await select.getOptions();
    expect(options.length).toBe(3);

    await select.clickOptions({ text: 'weekly' });

    expect(component.frequency()).toBe('weekly');
    expect(await select.getValueText()).toBe('weekly');
  });

  it('finds the overlay through the document root loader as well', async () => {
    await (await loader.getHarness(MatSlideToggleHarness)).check();
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();

    const overlayPresent = await rootLoader.getHarnessOrNull(MatSelectHarness);
    expect(overlayPresent).toBeTruthy();

    await select.close();
  });

  it('disables the save button while notifications are on with no channel', async () => {
    await (await loader.getHarness(MatSlideToggleHarness)).check();
    const save = await loader.getHarness(MatButtonHarness.with({ text: /Save preferences/ }));

    expect(await save.isDisabled()).toBe(true);
  });

  it('saves the summary when the button is clicked through the harness', async () => {
    await (await loader.getHarness(MatSlideToggleHarness)).check();
    await (await loader.getHarness(MatCheckboxHarness.with({ label: 'Email' }))).check();

    const save = await loader.getHarness(MatButtonHarness.with({ text: /Save preferences/ }));
    await save.click();

    expect(component.saved()).toBe('email daily');
    expect(fixture.nativeElement.querySelector('[data-testid="saved"]').textContent).toContain(
      'email daily'
    );
  });

  it('turns everything off again through the toggle', async () => {
    const toggle = await loader.getHarness(MatSlideToggleHarness);
    await toggle.check();
    await toggle.uncheck();

    expect(component.summary()).toBe('notifications are off');
  });
});
