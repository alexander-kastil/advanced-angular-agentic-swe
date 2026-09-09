export interface ModelContextLike {
  registerTool(tool: unknown, options?: { signal?: AbortSignal }): Promise<unknown>;
}

/**
 * WebMCP ships behind an origin trial, so the surface is absent unless the page
 * carries a token for its origin. Chrome exposes it on document, older builds on navigator.
 */
export function modelContext(): ModelContextLike | null {
  const host = globalThis as unknown as {
    document?: { modelContext?: ModelContextLike };
    navigator?: { modelContext?: ModelContextLike };
  };

  const context = host.document?.modelContext ?? host.navigator?.modelContext;
  return context && typeof context.registerTool === 'function' ? context : null;
}
