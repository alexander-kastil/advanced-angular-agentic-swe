import { describe, expect, it, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SecretsStore } from './secrets-store';
import { SecretList } from '../secret-lists/secret-list';

const lists: SecretList[] = [
  { listId: 'l1', name: 'Cloud Provider Keys', description: null, type: 1, secretCount: 2 },
  { listId: 'l2', name: 'Team Documents', description: null, type: 2, secretCount: 1 },
];

describe('SecretsStore', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  it('splits the loaded lists by type', async () => {
    const store = TestBed.inject(SecretsStore);
    const loading = store.loadLists();
    http.expectOne('/api/lists').flush(lists);
    await loading;

    expect(store.secretsLists().map((l) => l.name)).toEqual(['Cloud Provider Keys']);
    expect(store.vaultLists().map((l) => l.name)).toEqual(['Team Documents']);
  });

  it('resolves the selected list from the route id', async () => {
    const store = TestBed.inject(SecretsStore);
    const loading = store.loadLists();
    http.expectOne('/api/lists').flush(lists);
    await loading;

    store.selectList('l2');
    expect(store.selectedList()?.name).toBe('Team Documents');
  });
});
