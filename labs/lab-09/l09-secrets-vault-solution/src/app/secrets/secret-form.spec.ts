import { describe, expect, it, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SecretForm } from './secret-form';
import { Secret } from './secret';
import { Category } from './category';

const secret: Secret = {
  secretId: 's1',
  listId: 'l1',
  name: 'hetzner-api-token',
  url: 'https://console.hetzner.cloud',
  user: null,
  password: null,
  comment: 'Provisions the training VPS boxes.',
  mfa: false,
  categoryIds: [],
  version: 1,
  lastChanged: '2026-09-01T09:00:00Z',
  fileName: null,
  contentType: null,
  fileSize: null,
};

const categories: Category[] = [
  { categoryId: 'c1', listId: 'l1', topic: 'Azure', color: '#0078D4', secretCount: 1 },
  { categoryId: 'c2', listId: 'l1', topic: 'Hetzner', color: '#D50C2D', secretCount: 1 },
  { categoryId: 'c3', listId: 'l1', topic: 'DeepInfra', color: '#8B5CF6', secretCount: 1 },
  { categoryId: 'c4', listId: 'l1', topic: 'Rotation Due', color: '#F59E0B', secretCount: 0 },
];

function mount() {
  const fixture = TestBed.createComponent(SecretForm);
  fixture.componentRef.setInput('secret', secret);
  fixture.componentRef.setInput('categories', categories);
  fixture.detectChanges();
  return fixture;
}

describe('SecretForm', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretForm],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  it('fills the model from the secret input', () => {
    const fixture = mount();
    expect(fixture.componentInstance.model().name).toBe('hetzner-api-token');
    expect(fixture.componentInstance.model().user).toBe('');
  });

  it('rejects a name the vault already holds', async () => {
    const fixture = mount();
    const component = fixture.componentInstance;

    component.model.update((m) => ({ ...m, name: 'hetzner-dns-token' }));
    fixture.detectChanges();
    // validateHttp debounces by 400ms, so the request is not queued yet.
    await new Promise((resolve) => setTimeout(resolve, 500));

    http
      .expectOne('/api/secrets/hetzner-dns-token?listId=l1')
      .flush({ ...secret, name: 'hetzner-dns-token' });
    await new Promise((resolve) => setTimeout(resolve, 50));
    fixture.detectChanges();

    expect(component.secretForm.name().errors().map((e) => e.kind)).toContain('nameTaken');
    expect(component.canSave()).toBe(false);
  });

  it('caps the category selection at three', () => {
    const fixture = mount();
    const component = fixture.componentInstance;

    for (const category of categories) component.toggleCategory(category.categoryId);
    fixture.detectChanges();

    expect(component.model().categoryIds).toHaveLength(4);
    expect(component.secretForm.categoryIds().errors()).not.toHaveLength(0);
    expect(component.canSave()).toBe(false);
  });
});
