import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const EXCLUDED = '.as-split-gutter';

const routes = [
  { name: 'home', path: '/' },
  { name: 'accessible ui', path: '/demos/a11y' },
  { name: 'compliance gates', path: '/demos/compliance-gates' },
  { name: 'consent gated scripts', path: '/demos/consent-gated-scripts' },
  { name: 'zoneless', path: '/demos/zoneless' },
  { name: 'defer by trigger', path: '/demos/defer-by-trigger' },
  { name: 'devtools profiling', path: '/demos/devtools-profiling' }
];

for (const route of routes) {
  test(`${route.name} has no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(route.path);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .exclude(EXCLUDED)
      .analyze();

    const summary = results.violations.map(
      violation => `${violation.id} (${violation.impact}) on ${violation.nodes.length} node(s): ${violation.help}`
    );

    expect(summary, summary.join('\n')).toEqual([]);
  });
}
