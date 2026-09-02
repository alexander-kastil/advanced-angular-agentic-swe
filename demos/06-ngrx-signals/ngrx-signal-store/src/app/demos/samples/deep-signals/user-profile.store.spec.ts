import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { UserProfileStore } from './user-profile.store';

describe('UserProfileStore (deep signals and union slices)', () => {
  let store: InstanceType<typeof UserProfileStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [UserProfileStore] });
    store = TestBed.inject(UserProfileStore);
  });

  it('exposes every nested record property as its own signal', () => {
    expect(store.user.name()).toBe('Jane Doe');
    expect(store.user.address.city()).toBe('Vienna');
    expect(store.user.address.zip()).toBe('1190');
    expect(store.fullAddress()).toBe('Am Himmel 18, 1190 Vienna');
  });

  it('updates only the touched nested property and leaves its siblings identical', () => {
    const streetBefore = store.user.address.street();

    store.updateCity('Graz');

    expect(store.user.address.city()).toBe('Graz');
    expect(store.user.address.street()).toBe(streetBefore);
    expect(store.fullAddress()).toBe('Am Himmel 18, 1190 Graz');
  });

  it('recomputes fullAddress from two separate nested updates', () => {
    store.updateCity('Linz');
    store.updateZip('4020');

    expect(store.fullAddress()).toBe('Am Himmel 18, 4020 Linz');
  });

  it('keeps a record slice stable but reshapes a union slice when the member changes', () => {
    const address = store.user.address as unknown as Record<string, unknown>;
    const contact = store.contact as unknown as Record<string, unknown>;

    expect(typeof address['city']).toBe('function');
    expect(typeof contact['address']).toBe('function');
    expect(typeof contact['number']).toBe('undefined');

    store.usePhone();

    expect(typeof address['city']).toBe('function');
    expect(typeof contact['address']).toBe('undefined');
    expect(typeof contact['number']).toBe('function');
  });

  it('requires narrowing the union slice instead of reading a nested signal', () => {
    const contact = store.contact();

    expect(contact.kind).toBe('email');
    expect(contact.kind === 'email' ? contact.address : '').toBe('jane@example.com');
    expect(store.contactLabel()).toBe('jane@example.com');
  });

  it('switches the union member and re-narrows the derived label', () => {
    store.usePhone();

    const phone = store.contact();
    expect(phone.kind).toBe('phone');
    expect(store.contactLabel()).toBe('+43 660 1234567');

    store.useEmail();

    expect(store.contact().kind).toBe('email');
    expect(store.contactLabel()).toBe('jane@example.com');
  });

  it('toggles edit mode without touching the profile', () => {
    store.toggleEditMode();
    expect(store.editMode()).toBe(true);

    store.toggleEditMode();
    expect(store.editMode()).toBe(false);
    expect(store.user.name()).toBe('Jane Doe');
  });
});
