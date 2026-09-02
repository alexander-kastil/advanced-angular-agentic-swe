import { test as base, expect, type Page } from '@playwright/test';

declare global {
  interface Window {
    __webmcp: {
      tools: { name: string; description: string; inputSchema: unknown }[];
      call(name: string, args: Record<string, unknown>): Promise<unknown>;
    };
  }
}

type RegisteredTool = {
  name: string;
  description: string;
  inputSchema: unknown;
  execute: (args: unknown, client: unknown) => unknown;
};

const bridgeScript = () => {
  const registry: RegisteredTool[] = [];

  (navigator as unknown as { modelContext: unknown }).modelContext = {
    registerTool(tool: RegisteredTool) {
      registry.push(tool);
      return Promise.resolve();
    },
  };

  window.__webmcp = {
    get tools() {
      return registry.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }));
    },
    async call(name: string, args: Record<string, unknown>) {
      const tool = registry.find((t) => t.name === name);
      if (!tool) {
        throw new Error(`tool ${name} is not registered on this page`);
      }
      return await tool.execute(args, { signal: new AbortController().signal });
    },
  };
};

export class WebmcpPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/demos/webmcp-e2e');
    await expect(this.page.getByTestId('bridge')).toHaveText(/WebMCP bridge detected/);
  }

  toolNames() {
    return this.page.evaluate(() => window.__webmcp.tools.map((t) => t.name));
  }

  callTool(name: string, args: Record<string, unknown> = {}) {
    return this.page.evaluate(
      ([toolName, toolArgs]) => window.__webmcp.call(toolName as string, toolArgs as Record<string, unknown>),
      [name, args] as const
    );
  }

  rows() {
    return this.page.getByTestId('book-row');
  }

  openCount() {
    return this.page.getByTestId('open-count');
  }
}

type WebmcpFixtures = { webmcp: WebmcpPage };

export const test = base.extend<WebmcpFixtures>({
  webmcp: async ({ page }, use) => {
    await page.addInitScript(bridgeScript);
    const webmcp = new WebmcpPage(page);
    await webmcp.goto();
    await use(webmcp);
  },
});

export { expect };
