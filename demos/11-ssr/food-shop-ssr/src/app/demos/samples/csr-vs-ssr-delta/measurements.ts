export interface RenderMeasurement {
  path: string;
  mode: string;
  htmlBytes: number;
  ttfbMs: number;
  contentInHtml: string;
}

export const MEASURED_AT = '2026-09-02, Node 24.15.0, Angular CLI 22.1.5, production build';

export const MEASUREMENTS: RenderMeasurement[] = [
  {
    path: '/index.csr.html',
    mode: 'CSR shell',
    htmlBytes: 69770,
    ttfbMs: 1.7,
    contentInHtml: 'none, an empty <app-root>',
  },
  {
    path: '/',
    mode: 'prerendered at build time',
    htmlBytes: 91242,
    ttfbMs: 1.7,
    contentInHtml: 'all three dish names and prices',
  },
  {
    path: '/food/2',
    mode: 'prerendered at build time',
    htmlBytes: 107953,
    ttfbMs: 1.6,
    contentInHtml: 'the full Blini with Salmon card',
  },
  {
    path: '/food/99',
    mode: 'server rendered per request',
    htmlBytes: 102317,
    ttfbMs: 30.7,
    contentInHtml: 'the resolved "No dish found" branch',
  },
];
