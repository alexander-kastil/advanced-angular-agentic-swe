import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule } from 'ngx-markdown';
import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentWriteComponent } from './component-write.component';

describe('ComponentWriteComponent', () => {
  let fixture: ComponentFixture<ComponentWriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ComponentWriteComponent,
        NoopAnimationsModule,
        MarkdownModule.forRoot()
      ],
      providers: [
        provideHttpClient(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ComponentWriteComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should be display the written Value', () => {
    const soi = 'Soi the Whippet';
    fixture.autoDetectChanges();
    const input = fixture.debugElement.query(By.css('[data-testid=username]'));
    const el = input.nativeElement as HTMLInputElement;
    el.value = soi;
    el.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.user().username).toBe(soi);
  })
});
