import { CapitalizeDirective } from './capitalize.directive';
import { DirectiveComponent } from './directive.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Component - Directive - CapitalizeDirective', () => {
  let component: DirectiveComponent;
  let fixture: ComponentFixture<DirectiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, CapitalizeDirective, DirectiveComponent],
    });

    fixture = TestBed.createComponent(DirectiveComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should capitalize text when initially clicked', () => {
    const debugEl: HTMLElement = fixture.debugElement.nativeElement;
    const div: HTMLElement = debugEl.querySelector('[data-testid="divDirective"]') as HTMLElement;
    div.click();
    expect(div.style.textTransform).toBe('uppercase');
  });

  it('should lowercase when clicked twice', () => {
    const debugEl: HTMLElement = fixture.debugElement.nativeElement;
    const div: HTMLElement = debugEl.querySelector('[data-testid="divDirective"]') as HTMLElement;
    div.click();
    div.click();
    expect(div.style.textTransform).toBe('lowercase');
  });
});
