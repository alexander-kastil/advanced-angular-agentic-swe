import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach } from 'vitest';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialAsyncComponent } from './material-async.component';
import { provideHttpClient } from '@angular/common/http';

describe('MaterialAsyncComponent', () => {
  let fixture: ComponentFixture<MaterialAsyncComponent>;
  let component: MaterialAsyncComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MaterialAsyncComponent,
        MarkdownModule.forRoot(),
      ],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialAsyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 3 tags', () => {
    fixture.detectChanges();
    let tags = fixture.nativeElement.querySelectorAll('.mat-mdc-tab');
    expect(tags.length).toBe(3);
  });
})
