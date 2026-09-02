import { test, expect } from './webmcp.fixture';

test.describe('WebMCP - the page exposes its tools', () => {
  test('registers every tool the demo declares', async ({ webmcp }) => {
    expect(await webmcp.toolNames()).toEqual(['list_reading_list', 'add_book', 'mark_read']);
  });

  test('lists the seeded books', async ({ webmcp }) => {
    const listing = (await webmcp.callTool('list_reading_list')) as string;

    expect(listing).toContain('Refactoring by Martin Fowler');
    expect(listing).toContain('Working Effectively with Legacy Code by Michael Feathers');
  });
});

test.describe('WebMCP - driving the app through the tools', () => {
  test('adding a book renders a new row', async ({ webmcp }) => {
    await expect(webmcp.rows()).toHaveCount(2);

    const result = await webmcp.callTool('add_book', {
      title: 'Test Driven Development',
      author: 'Kent Beck',
    });

    expect(result).toBe('Added Test Driven Development by Kent Beck.');
    await expect(webmcp.rows()).toHaveCount(3);
    await expect(webmcp.rows().last()).toContainText('Test Driven Development');
  });

  test('marking a book read updates the open count in the UI', async ({ webmcp }) => {
    await expect(webmcp.openCount()).toHaveText('1 still open');

    await webmcp.callTool('mark_read', { title: 'Working Effectively with Legacy Code' });

    await expect(webmcp.openCount()).toHaveText('0 still open');
  });

  test('an unknown title is answered, not thrown', async ({ webmcp }) => {
    const result = await webmcp.callTool('mark_read', { title: 'Nothing Here' });

    expect(result).toBe('Nothing Here is not on the reading list.');
    await expect(webmcp.openCount()).toHaveText('1 still open');
  });

  test('the agent path and the rendered page stay in sync', async ({ webmcp }) => {
    await webmcp.callTool('add_book', { title: 'Growing Object-Oriented Software', author: 'Freeman' });
    await webmcp.callTool('mark_read', { title: 'Growing Object-Oriented Software' });

    const listing = (await webmcp.callTool('list_reading_list')) as string;

    expect(listing).toContain('[read] Growing Object-Oriented Software');
    await expect(webmcp.openCount()).toHaveText('1 still open');
  });
});
