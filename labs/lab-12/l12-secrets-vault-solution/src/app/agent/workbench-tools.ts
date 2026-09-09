import { inject, Injector, runInInjectionContext } from '@angular/core';
import {
  declareExperimentalWebMcpTool,
  provideExperimentalWebMcpTools,
  WebMcpToolDescriptor,
} from '@angular/core';
import { Router } from '@angular/router';

type ToolArgs = Record<string, unknown>;
import { SecretsStore } from '../store/secrets-store';

const NOT_EXPOSED = [
  'reveal a secret value',
  'export every secret as CSV',
  'delete a secret or a list',
];

export const workbenchTools: WebMcpToolDescriptor<any>[] = [
    {
      name: 'list_secret_lists',
      description:
        'Lists the secret lists in the workbench with their id, name, kind and how many secrets each holds. Start here to get the listId every other tool takes.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: () => {
        const store = inject(SecretsStore);
        return JSON.stringify(
          store.listEntities().map((list) => ({
            listId: list.listId,
            name: list.name,
            kind: list.type === 2 ? 'Vault' : 'Secrets',
            secretCount: list.secretCount,
          })),
        );
      },
    },
    {
      name: 'open_list',
      description:
        'Navigates the workbench to one secret list, so the user sees the same list the agent is talking about.',
      inputSchema: {
        type: 'object',
        properties: { listId: { type: 'string', description: 'The list id from list_secret_lists.' } },
        required: ['listId'],
        additionalProperties: false,
      },
      execute: async (args: ToolArgs) => {
        const listId = args['listId'] as string;
        const router = inject(Router);
        await router.navigate(['/secrets', listId]);
        return `Opened list ${listId}.`;
      },
    },
    {
      name: 'search_secrets',
      description:
        'Types a term into the workbench search box and returns the names of the secrets that match in the open list. The values themselves are never returned.',
      inputSchema: {
        type: 'object',
        properties: { term: { type: 'string', description: 'The text to search for.' } },
        required: ['term'],
        additionalProperties: false,
      },
      execute: async (args: ToolArgs) => {
        const store = inject(SecretsStore);
        store.setSearch(args['term'] as string);
        await store.loadSecrets();
        return JSON.stringify(store.visibleSecrets().map((secret) => secret.name));
      },
    },
    {
      name: 'open_secret',
      description:
        'Opens one secret by name in the currently selected list and returns its metadata. The secret value stays masked on screen and is not returned.',
      inputSchema: {
        type: 'object',
        properties: { name: { type: 'string', description: 'The exact secret name.' } },
        required: ['name'],
        additionalProperties: false,
      },
      execute: async (args: ToolArgs) => {
        const name = args['name'] as string;
        const store = inject(SecretsStore);
        const router = inject(Router);
        const secret = store.secretEntities().find((entry) => entry.name === name);
        if (!secret) return `No secret named ${name} in the open list.`;

        await router.navigate(['/secrets', secret.listId, secret.secretId]);
        return JSON.stringify({
          name: secret.name,
          user: secret.user,
          url: secret.url,
          mfa: secret.mfa,
          version: secret.version,
          categoryIds: secret.categoryIds,
        });
      },
    },
    {
      name: 'describe_withheld_tools',
      description:
        'Explains which workbench capabilities are deliberately not exposed to an agent and why.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: () =>
        `These are not exposed as tools: ${NOT_EXPOSED.join('; ')}. Each one moves a credential out of the user's sight, so it stays behind a human click.`,
    },
];

export function provideWorkbenchTools() {
  return provideExperimentalWebMcpTools([...workbenchTools]);
}

export async function declareRenameTool(injector: Injector): Promise<void> {
  await runInInjectionContext(injector, () =>
    declareExperimentalWebMcpTool(
      {
        name: 'propose_secret_rename',
        description:
          'Types a new name into the open secret form so the user can review and save it. The agent never saves; the Save button stays a human action.',
        inputSchema: {
          type: 'object',
          properties: { newName: { type: 'string', description: 'The proposed new name.' } },
          required: ['newName'],
          additionalProperties: false,
        },
        execute: (args: ToolArgs) => {
          const store = inject(SecretsStore);
          const secret = store.openSecret();
          if (!secret) return 'No secret is open, so there is nothing to rename.';
          return `Proposed renaming ${secret.name} to ${args['newName'] as string}. The user still has to press Save.`;
        },
      },
      injector,
    ),
  );
}
