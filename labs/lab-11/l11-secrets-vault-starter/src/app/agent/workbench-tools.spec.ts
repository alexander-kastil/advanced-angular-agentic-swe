import { describe, expect, it, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { runInInjectionContext, EnvironmentInjector } from '@angular/core';
import { workbenchTools } from './workbench-tools';
import { modelContext } from './webmcp-availability';
import { SecretsStore } from '../store/secrets-store';

const lists = [
  { listId: 'l1', name: 'Cloud Provider Keys', description: null, type: 1, secretCount: 1 },
  { listId: 'l2', name: 'Team Documents', description: null, type: 2, secretCount: 0 },
];

const secrets = [
  {
    secretId: 's1',
    listId: 'l1',
    name: 'hetzner-api-token',
    url: 'https://console.hetzner.cloud',
    user: 'ops',
    password: 'super-secret-value',
    comment: 'Provisions the training VPS boxes.',
    mfa: true,
    categoryIds: ['c1'],
    version: 3,
    lastChanged: '2026-09-01T09:00:00Z',
    fileName: null,
    contentType: null,
    fileSize: null,
  },
];

async function run(name: string, args: Record<string, unknown> = {}) {
  const tool = workbenchTools.find((entry) => entry.name === name)!;
  const injector = TestBed.inject(EnvironmentInjector);
  return await runInInjectionContext(injector, () => tool.execute(args, {} as never));
}

describe('workbench tools', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'secrets/:listId', children: [] },
          { path: 'secrets/:listId/:secretId', children: [] },
        ]),
      ],
    });
    http = TestBed.inject(HttpTestingController);

    const store = TestBed.inject(SecretsStore);
    const loading = store.loadLists();
    http.expectOne('/api/lists').flush(lists);
    await loading;

    store.selectList('l1');
    const loadingSecrets = store.loadSecrets();
    http.expectOne('/api/secrets?listId=l1').flush(secrets);
    await loadingSecrets;
  });

  it('exposes the lists without leaking anything else', async () => {
    const result = JSON.parse((await run('list_secret_lists')) as string);
    expect(result).toEqual([
      { listId: 'l1', name: 'Cloud Provider Keys', kind: 'Secrets', secretCount: 1 },
      { listId: 'l2', name: 'Team Documents', kind: 'Vault', secretCount: 0 },
    ]);
  });

  it('returns names from a search, never values', async () => {
    const promise = run('search_secrets', { term: 'hetzner' });
    http.expectOne('/api/secrets?listId=l1&search=hetzner').flush(secrets);
    const result = (await promise) as string;

    expect(JSON.parse(result)).toEqual(['hetzner-api-token']);
    expect(result).not.toContain('super-secret-value');
  });

  it('returns metadata but no value when opening a secret', async () => {
    const result = (await run('open_secret', { name: 'hetzner-api-token' })) as string;

    expect(JSON.parse(result).version).toBe(3);
    expect(result).not.toContain('super-secret-value');
    expect(result).not.toContain('Provisions the training VPS boxes.');
  });

  it('reports the browser surface as absent without the origin trial', () => {
    expect(modelContext()).toBeNull();
  });

  it('exposes no tool that reveals, exports or deletes', () => {
    const names = workbenchTools.map((tool) => tool.name);
    expect(names).not.toContain('reveal_secret');
    expect(names).not.toContain('export_secrets');
    expect(names).not.toContain('delete_secret');
  });
});
