# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demo-layouts.spec.ts >> Demo layout >> Split pane retention >> demoPaneSize persists after drag and guide toggle
- Location: e2e\demo-layouts.spec.ts:112:13

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: page.waitForFunction: Test timeout of 15000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - generic [ref=f1e4]:
    - navigation "Main" [ref=f1e6]:
      - img "Angular" [ref=f1e7]
      - generic [ref=f1e8]:
        - link "Home" [ref=f1e9] [cursor=pointer]:
          - /url: /
        - link "Demos" [ref=f1e10] [cursor=pointer]:
          - /url: /demos
        - link "Skills" [ref=f1e11] [cursor=pointer]:
          - /url: /skills
        - link "Customers" [ref=f1e12] [cursor=pointer]:
          - /url: /customers
        - link "Topics" [ref=f1e13] [cursor=pointer]:
          - /url: /topics
    - generic:
      - status
  - main [ref=f1e14]:
    - heading "Demos - Deep Signals" [level=1] [ref=f1e15]
    - generic [ref=f1e18]:
      - complementary [ref=f1e19]:
        - generic [ref=f1e20]:
          - generic [ref=f1e21]: NgRx SignalState
          - button "Collapse navigation" [expanded] [ref=f1e22] [cursor=pointer]:
            - generic [ref=f1e23]: chevron_left
        - navigation "Demos" [ref=f1e24]:
          - link "SignalStore App State" [ref=f1e26] [cursor=pointer]:
            - /url: /demos/app-state
          - link "SignalStore Entities" [ref=f1e28] [cursor=pointer]:
            - /url: /demos/store-entities
          - link "Deep Signals" [ref=f1e30] [cursor=pointer]:
            - /url: /demos/deep-signals
        - link "Crafted with AI by integrations.at" [ref=f1e33] [cursor=pointer]:
          - /url: https://integrations.at
          - generic [ref=f1e36]: Crafted with AI by
          - img "Integrations" [ref=f1e37]
      - generic [ref=f1e39]:
        - generic [ref=f1e40]: "Component: DeepSignalComponent"
        - generic [ref=f1e44]:
          - generic [ref=f1e48]:
            - generic [ref=f1e49]:
              - heading "User Profile - Deep Signals" [level=2] [ref=f1e51]
              - generic [ref=f1e52]:
                - generic [ref=f1e53]:
                  - paragraph [ref=f1e54]:
                    - strong [ref=f1e55]: "Name:"
                    - text: Jane Doe
                  - paragraph [ref=f1e56]:
                    - strong [ref=f1e57]: "Email:"
                    - text: jane@example.com
                  - paragraph [ref=f1e58]:
                    - strong [ref=f1e59]: "Street:"
                    - text: Am Himmel 18
                  - paragraph [ref=f1e60]:
                    - strong [ref=f1e61]: "City:"
                    - text: Vienna
                  - paragraph [ref=f1e62]:
                    - strong [ref=f1e63]: "Zip:"
                    - text: "1190"
                  - paragraph [ref=f1e64]:
                    - strong [ref=f1e65]: "Full Address (computed):"
                    - text: Am Himmel 18, 1190 Vienna
                - generic [ref=f1e66]:
                  - generic [ref=f1e67]:
                    - generic [ref=f1e68]: City
                    - textbox "City" [ref=f1e69]: Vienna
                  - generic [ref=f1e70]:
                    - generic [ref=f1e71]: Zip
                    - textbox "Zip" [ref=f1e72]: "1190"
            - generic [ref=f1e73]:
              - heading "The Union Case" [level=2] [ref=f1e75]
              - generic [ref=f1e76]:
                - paragraph [ref=f1e77]:
                  - text: The
                  - code [ref=f1e78]: contact
                  - text: slice is a union of two record types, so there is no single set of nested keys to hand out. Read it whole and narrow on the discriminant instead of reaching for
                  - code [ref=f1e79]: store.contact.address()
                  - text: .
                - paragraph [ref=f1e80]:
                  - strong [ref=f1e81]: "Email contact:"
                  - text: jane@example.com
                - generic [ref=f1e82]:
                  - button "Use email" [ref=f1e83] [cursor=pointer]
                  - button "Use phone" [ref=f1e84] [cursor=pointer]
          - generic [ref=f1e86]:
            - button "Instructions expand_less" [ref=f1e87] [cursor=pointer]:
              - generic [ref=f1e88]: Instructions
              - generic [ref=f1e89]: expand_less
            - region "Instructions" [ref=f1e90]:
              - generic [ref=f1e91]:
                - paragraph [ref=f1e92]:
                  - text: SignalStore exposes nested state properties as individual signals. This means you can read
                  - code [ref=f1e93]: store.user.address.city()
                  - text: instead of
                  - code [ref=f1e94]: store.user().address.city
                  - text: — each level is its own signal providing fine-grained reactivity.
                - heading "User Profile Store" [level=2] [ref=f1e95]
                - paragraph [ref=f1e96]:
                  - text: Examine
                  - code [ref=f1e97]: user-profile.store.ts
                  - text: . The state contains a nested
                  - code [ref=f1e98]: address
                  - text: "object:"
                - code [ref=f1e100]:
                  - text: "type UserProfileState = { user: UserProfile; editMode: boolean; }; export const UserProfileStore = signalStore( withState(initialState), withComputed((store) => ({ fullAddress: computed(() => { const addr = store.user.address; return"
                  - generic [ref=f1e101]:
                    - text: "`"
                    - generic [ref=f1e102]: "${addr.street()}"
                    - text: ","
                    - generic [ref=f1e103]: "${addr.zip()}"
                    - generic [ref=f1e104]: "${addr.city()}"
                    - text: "`"
                  - text: "; }), })), withMethods((store) => ({ updateCity(city: string) { patchState(store, (state) => ({ user: { ...state.user, address: { ...state.user.address, city }, }, })); }, })) );"
                - heading "Deep Signal Access in Templates" [level=2] [ref=f1e105]
                - paragraph [ref=f1e106]:
                  - text: Access nested properties directly — no intermediate
                  - code [ref=f1e107]: ()
                  - text: "calls needed:"
                - code [ref=f1e109]:
                  - generic [ref=f1e110]:
                    - generic [ref=f1e111]: <p
                    - text: ">"
                  - text: "{{ store.user.name() }}"
                  - generic [ref=f1e112]:
                    - generic [ref=f1e113]: </p
                    - text: ">"
                  - generic [ref=f1e114]:
                    - generic [ref=f1e115]: <p
                    - text: ">"
                  - text: "{{ store.user.address.city() }}"
                  - generic [ref=f1e116]:
                    - generic [ref=f1e117]: </p
                    - text: ">"
                  - generic [ref=f1e118]:
                    - generic [ref=f1e119]: <p
                    - text: ">"
                  - text: "{{ store.fullAddress() }}"
                  - generic [ref=f1e120]:
                    - generic [ref=f1e121]: </p
                    - text: ">"
                - heading "The Union Case" [level=2] [ref=f1e122]
                - paragraph [ref=f1e123]: "Deep signals thin out at a slice whose type is a union of records, and that is deliberate. Only a key present on every member of the union survives, because the value could be either shape:"
                - code [ref=f1e125]: "export type Contact = | { kind: 'email'; address: string } | { kind: 'phone'; number: string; countryCode: string }; type UserProfileState = { user: UserProfile; contact: Contact; editMode: boolean; };"
                - paragraph [ref=f1e126]:
                  - code [ref=f1e127]: DeepSignalOf<Contact>
                  - text: distributes over the union and resolves to
                  - code [ref=f1e128]: "DeepSignal<{ kind: 'email'; address: string }> | DeepSignal<{ kind: 'phone'; number: string; countryCode: string }>"
                  - text: .
                  - code [ref=f1e129]: store.contact.kind
                  - text: therefore still compiles, because
                  - code [ref=f1e130]: kind
                  - text: is on both members, while
                  - code [ref=f1e131]: store.contact.address()
                  - text: does not, because
                  - code [ref=f1e132]: address
                  - text: "is only on one. Add a non-record member and that one loses its deep members too:"
                  - code [ref=f1e133]: Contact | null
                  - text: resolves to
                  - code [ref=f1e134]: DeepSignal<Email> | DeepSignal<Phone> | Signal<null>
                  - text: ", and even"
                  - code [ref=f1e135]: store.contact.kind
                  - text: stops compiling.
                - paragraph [ref=f1e136]: "Narrow on the discriminant instead, either in a computed:"
                - code [ref=f1e138]:
                  - text: "contactLabel: computed(() => { const contact = store.contact(); return contact.kind === 'email' ? contact.address :"
                  - generic [ref=f1e139]:
                    - text: "`"
                    - generic [ref=f1e140]: "${contact.countryCode}"
                    - generic [ref=f1e141]: "${contact.number}"
                    - text: "`"
                  - text: "; }),"
                - paragraph [ref=f1e142]: "or in the template:"
                - code [ref=f1e144]:
                  - text: "@switch (store.contact().kind) { @case ('email') {"
                  - generic [ref=f1e145]:
                    - generic [ref=f1e146]: <p
                    - text: ">"
                  - text: "{{ store.contactLabel() }}"
                  - generic [ref=f1e147]:
                    - generic [ref=f1e148]: </p
                    - text: ">"
                  - text: "} @case ('phone') {"
                  - generic [ref=f1e149]:
                    - generic [ref=f1e150]: <p
                    - text: ">"
                  - text: "{{ store.contactLabel() }}"
                  - generic [ref=f1e151]:
                    - generic [ref=f1e152]: </p
                    - text: ">"
                  - text: "} }"
                - paragraph [ref=f1e153]: "Writing a union slice is a whole replacement, never a partial patch, because there is no shared shape to merge into:"
                - code [ref=f1e155]: "usePhone() { patchState(store, { contact: { kind: 'phone', number: '660 1234567', countryCode: '+43' } }); },"
                - heading "Key Points" [level=2] [ref=f1e156]
                - list [ref=f1e157]:
                  - listitem [ref=f1e158]:
                    - text: Deep signals auto-unwrap nested state —
                    - code [ref=f1e159]: store.user.address.city()
                    - text: is a signal
                  - listitem [ref=f1e160]:
                    - code [ref=f1e161]: withComputed
                    - text: can reference deep signals for derived state
                  - listitem [ref=f1e162]:
                    - code [ref=f1e163]: patchState
                    - text: with an updater function preserves immutability for nested updates
                  - listitem [ref=f1e164]: A union-typed slice is read whole and narrowed; it has no deep members
          - separator
        - generic [ref=f1e167]:
          - button "Toggle the SideNav" [ref=f1e168] [cursor=pointer]:
            - generic [ref=f1e169]: menu
            - text: Toggle the SideNav
          - button "Toggle Markdown Guide" [ref=f1e170] [cursor=pointer]:
            - generic [ref=f1e171]: menu_book
            - text: Toggle Markdown Guide
          - button "Open Editor" [ref=f1e172] [cursor=pointer]:
            - generic [ref=f1e173]: edit_square
            - text: Open Editor
```

# Test source

```ts
  31  |             await page.goto('/demos/store-entities', { waitUntil: 'networkidle' });
  32  |             const demoPaneArea = page.locator('as-split-area').first();
  33  |             await expect(demoPaneArea).not.toHaveClass(/as-hidden/);
  34  |         });
  35  | 
  36  |         test('demo pane is visible when component has content (deep-signals)', async ({ page }) => {
  37  |             await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
  38  |             const demoPaneArea = page.locator('as-split-area').first();
  39  |             await expect(demoPaneArea).not.toHaveClass(/as-hidden/);
  40  |         });
  41  |     });
  42  | 
  43  |     test.describe('Markdown pane', () => {
  44  |         test('opens on guide button click when demo has markdown', async ({ page }) => {
  45  |             await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
  46  |             const guideBtn = page.locator('[data-tip="Toggle Markdown Guide"]');
  47  |             await guideBtn.click();
  48  |             await expect(page.locator('.as-split-gutter')).toBeVisible();
  49  |         });
  50  | 
  51  |         test('closes on second guide button click', async ({ page }) => {
  52  |             await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
  53  |             const guideBtn = page.locator('[data-tip="Toggle Markdown Guide"]');
  54  |             await guideBtn.click();
  55  |             await expect(page.locator('.as-split-gutter')).toBeVisible();
  56  |             await guideBtn.click();
  57  |             await expect(page.locator('.as-split-gutter')).not.toBeVisible();
  58  |         });
  59  | 
  60  |         test('splits with the demo pane on store-entities', async ({ page }) => {
  61  |             await page.goto('/demos/store-entities', { waitUntil: 'networkidle' });
  62  |             const guideBtn = page.locator('[data-tip="Toggle Markdown Guide"]');
  63  |             await guideBtn.click();
  64  |             const gutter = page.locator('.as-split-gutter');
  65  |             await expect(gutter).toBeVisible();
  66  |         });
  67  | 
  68  |         test('guide content visible after guide button click', async ({ page }) => {
  69  |             await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
  70  |             await page.locator('[data-tip="Toggle Markdown Guide"]').click();
  71  |             await expect(page.locator('app-markdown-renderer')).toBeVisible();
  72  |             await expect(page.locator('app-markdown-editor-container')).not.toBeVisible();
  73  |         });
  74  |     });
  75  | 
  76  |     test.describe('Editor toggle', () => {
  77  |         test('editor button shows edit_square icon when editor is closed', async ({ page }) => {
  78  |             await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
  79  |             const editorBtn = page.getByRole('button', { name: 'Open Editor' });
  80  |             await expect(editorBtn).toBeVisible();
  81  |             await expect(editorBtn.locator('.icon')).toHaveText('edit_square');
  82  |         });
  83  | 
  84  |         test('editor button opens editor pane and switches to cancel icon', async ({ page }) => {
  85  |             await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
  86  |             await page.getByRole('button', { name: 'Open Editor' }).click();
  87  |             await expect(page.getByRole('button', { name: 'Close Editor' })).toBeVisible();
  88  |             await expect(page.locator('app-markdown-editor-container')).toBeVisible();
  89  |             await expect(page.locator('app-markdown-renderer')).not.toBeVisible();
  90  |         });
  91  | 
  92  |         test('close editor hides pane and restores edit_square icon', async ({ page }) => {
  93  |             await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
  94  |             await page.getByRole('button', { name: 'Open Editor' }).click();
  95  |             await expect(page.getByRole('button', { name: 'Close Editor' })).toBeVisible();
  96  |             await page.getByRole('button', { name: 'Close Editor' }).click();
  97  |             await expect(page.getByRole('button', { name: 'Open Editor' })).toBeVisible();
  98  |             await expect(page.locator('.as-split-gutter')).not.toBeVisible();
  99  |         });
  100 | 
  101 |         test('guide button switches from editor to guide view', async ({ page }) => {
  102 |             await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
  103 |             await page.getByRole('button', { name: 'Open Editor' }).click();
  104 |             await expect(page.locator('app-markdown-editor-container')).toBeVisible();
  105 |             await page.locator('[data-tip="Toggle Markdown Guide"]').click();
  106 |             await expect(page.locator('app-markdown-renderer')).toBeVisible();
  107 |             await expect(page.locator('app-markdown-editor-container')).not.toBeVisible();
  108 |         });
  109 |     });
  110 | 
  111 |     test.describe('Split pane retention', () => {
  112 |         test('demoPaneSize persists after drag and guide toggle', async ({ page }) => {
  113 |             await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
  114 | 
  115 |             const guideBtn = page.locator('[data-tip="Toggle Markdown Guide"]');
  116 |             await guideBtn.click();
  117 | 
  118 |             const gutter = page.locator('.as-split-gutter').first();
  119 |             await expect(gutter).toBeVisible();
  120 | 
  121 |             const gutterBox = await gutter.boundingBox();
  122 |             if (gutterBox) {
  123 |                 const cx = gutterBox.x + gutterBox.width / 2;
  124 |                 const cy = gutterBox.y + gutterBox.height / 2;
  125 |                 await page.mouse.move(cx, cy);
  126 |                 await page.mouse.down();
  127 |                 await page.mouse.move(cx, cy - 150, { steps: 10 });
  128 |                 await page.mouse.up();
  129 |             }
  130 | 
> 131 |             await page.waitForFunction(
      |                        ^ Error: page.waitForFunction: Test timeout of 15000ms exceeded.
  132 |                 () => {
  133 |                     const state = JSON.parse(localStorage.getItem('layout-state') || '{}');
  134 |                     return state.demoPaneSize !== 500 && state.demoPaneSize !== undefined;
  135 |                 },
  136 |                 { timeout: 5000 }
  137 |             );
  138 | 
  139 |             const sizeAfterDrag = await page.evaluate<number>(() => {
  140 |                 const state = JSON.parse(localStorage.getItem('layout-state') || '{}');
  141 |                 return state.demoPaneSize;
  142 |             });
  143 | 
  144 |             expect(sizeAfterDrag).not.toBe(500);
  145 | 
  146 |             await guideBtn.click();
  147 |             await expect(gutter).not.toBeVisible();
  148 | 
  149 |             await guideBtn.click();
  150 |             await expect(gutter).toBeVisible();
  151 | 
  152 |             const sizeAfterToggle = await page.evaluate<number>(() => {
  153 |                 const state = JSON.parse(localStorage.getItem('layout-state') || '{}');
  154 |                 return state.demoPaneSize;
  155 |             });
  156 | 
  157 |             expect(sizeAfterToggle).toBeCloseTo(sizeAfterDrag, 0);
  158 |         });
  159 | 
  160 |         test('demoPaneSize persists across page reload', async ({ page }) => {
  161 |             await page.goto('/demos/deep-signals', { waitUntil: 'networkidle' });
  162 | 
  163 |             await page.evaluate(() => {
  164 |                 const state = JSON.parse(localStorage.getItem('layout-state') || '{}');
  165 |                 localStorage.setItem('layout-state', JSON.stringify({ ...state, demoPaneSize: 350 }));
  166 |             });
  167 | 
  168 |             await page.reload({ waitUntil: 'networkidle' });
  169 | 
  170 |             const savedSize = await page.evaluate<number>(() => {
  171 |                 const state = JSON.parse(localStorage.getItem('layout-state') || '{}');
  172 |                 return state.demoPaneSize;
  173 |             });
  174 | 
  175 |             expect(savedSize).toBe(350);
  176 |         });
  177 |     });
  178 | });
  179 | 
```