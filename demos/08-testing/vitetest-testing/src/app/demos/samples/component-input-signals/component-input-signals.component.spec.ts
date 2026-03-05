import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentInputSignalsComponent } from './component-input-signals.component';

describe('ComponentInputSignalsComponent', () => {
  let component: ComponentInputSignalsComponent;
  let fixture: ComponentFixture<ComponentInputSignalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MarkdownModule.forRoot(),
        BrowserAnimationsModule,
        ComponentInputSignalsComponent
      ],
      providers: [
        provideHttpClient()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ComponentInputSignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
