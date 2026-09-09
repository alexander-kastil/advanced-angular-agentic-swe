import { describe, expect, it, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SecretRow } from './secret-row';
import { Secret } from './secret';

const secret: Secret = {
  secretId: 'a1',
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

describe('SecretRow', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SecretRow] }).compileComponents();
  });

  it('masks the value until the reveal button is pressed', () => {
    const fixture = TestBed.createComponent(SecretRow);
    fixture.componentRef.setInput('secret', secret);
    fixture.detectChanges();

    const text = () => fixture.nativeElement.textContent as string;
    expect(text()).toContain('hetzner-api-token');
    expect(text()).not.toContain('Provisions the training VPS boxes.');

    fixture.nativeElement.querySelector('app-masked-value button').click();
    fixture.detectChanges();

    expect(text()).toContain('Provisions the training VPS boxes.');
  });
});
