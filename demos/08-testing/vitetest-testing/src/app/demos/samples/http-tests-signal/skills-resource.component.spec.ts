import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Skill } from '../../../skills/skill.model';
import { SkillsResourceComponent } from './skills-resource.component';
import { environment } from '../../../../environments/environment';

describe('Component - httpResource - SkillsResourceComponent', () => {
  let fixture: ComponentFixture<SkillsResourceComponent>;
  let controller: HttpTestingController;
  const url = `${environment.api}skills`;

  const mockSkills: Skill[] = [
    { id: 1, name: 'Angular', completed: true },
    { id: 2, name: 'TypeScript', completed: false },
    { id: 3, name: 'RxJs', completed: false },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsResourceComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    controller = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SkillsResourceComponent);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should show loading indicator before data arrives', () => {
    fixture.detectChanges();
    const loading = fixture.debugElement.query(By.css('[data-testid=loading]'));
    expect(loading).toBeTruthy();
    controller.expectOne(url).flush(mockSkills);
  });

  it('should render skill rows after data arrives', async () => {
    fixture.detectChanges();
    controller.expectOne(url).flush(mockSkills);
    await fixture.whenStable();
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('[data-testid=skill-row]'));
    expect(rows.length).toBe(3);
    expect(rows[0].nativeElement.textContent.trim()).toBe('Angular');
  });

  it('should make a GET request to the skills endpoint', () => {
    fixture.detectChanges();
    const req = controller.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockSkills);
  });

  it('should render empty list when no skills returned', () => {
    fixture.detectChanges();
    controller.expectOne(url).flush([]);
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('[data-testid=skill-row]'));
    expect(rows.length).toBe(0);
  });
});
