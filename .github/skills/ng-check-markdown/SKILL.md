---
name: ng-check-markdown
description: Complete installation and configuration guide for ngx-markdown and its plugins in Angular projects. Use when setting up markdown rendering with syntax highlighting, diagrams, and advanced features.
---

# ng-check-markdown Skill

Complete step-by-step guide to install and configure ngx-markdown with all optional plugins.

## Step 1: Install Core Dependencies

```bash
npm install ngx-markdown marked@^17.0.0 --save
```

**Validates**: ngx-markdown, marked

## Step 2: Install Syntax Highlighting (Prism.js)

### 2.1 Install Prism.js

```bash
npm install prismjs@^1.30.0 --save
```

### 2.2 Update angular.json - Add Prism Theme

Add to `projects.<project>.architect.build.options.styles`:

```json
"styles": [
  "src/styles.scss",
  "node_modules/prismjs/themes/prism-okaidia.min.css"
]
```

### 2.3 Update angular.json - Add Prism Core & Languages

Add to `projects.<project>.architect.build.options.scripts`:

```json
"scripts": [
  "node_modules/prismjs/prism.js",
  "node_modules/prismjs/components/prism-typescript.min.js",
  "node_modules/prismjs/components/prism-javascript.min.js",
  "node_modules/prismjs/components/prism-bash.min.js",
  "node_modules/prismjs/components/prism-csharp.min.js",
  "node_modules/prismjs/components/prism-css.min.js",
  "node_modules/prismjs/components/prism-html.min.js",
  "node_modules/prismjs/components/prism-json.min.js"
]
```

## Step 3: Install Optional Plugin - Line Numbers

### 3.1 Update angular.json - Add Line Numbers CSS

Add to `projects.<project>.architect.build.options.styles`:

```json
"node_modules/prismjs/plugins/line-numbers/prism-line-numbers.min.css"
```

### 3.2 Update angular.json - Add Line Numbers JS

Add to `projects.<project>.architect.build.options.scripts`:

```json
"node_modules/prismjs/plugins/line-numbers/prism-line-numbers.js"
```

### 3.3 Use in Templates

```html
<markdown lineNumbers [start]="1" [src]="'path/to/file.ts'"></markdown>
```

## Step 4: Install Optional Plugin - Line Highlight

### 4.1 Update angular.json - Add Line Highlight CSS

Add to `projects.<project>.architect.build.options.styles`:

```json
"node_modules/prismjs/plugins/line-highlight/prism-line-highlight.min.css"
```

### 4.2 Update angular.json - Add Line Highlight JS

Add to `projects.<project>.architect.build.options.scripts`:

```json
"node_modules/prismjs/plugins/line-highlight/prism-line-highlight.js"
```

### 4.3 Use in Templates

```html
<markdown lineHighlight [line]="'1-5, 10'" [src]="'path/to/file.ts'"></markdown>
```

## Step 5: Install Optional Plugin - Command Line

### 5.1 Update angular.json - Add Command Line CSS

Add to `projects.<project>.architect.build.options.styles`:

```json
"node_modules/prismjs/plugins/command-line/prism-command-line.min.css"
```

### 5.2 Update angular.json - Add Command Line JS

Add to `projects.<project>.architect.build.options.scripts`:

```json
"node_modules/prismjs/plugins/command-line/prism-command-line.js"
```

### 5.3 Use in Templates

```html
<markdown
  commandLine
  [user]="'alice'"
  [host]="'server'"
  [output]="'2, 4-6'"
  [src]="'path/to/file.bash'">
</markdown>
```

## Step 6: Install Mermaid Diagram Support

### 6.1 Install Mermaid

```bash
npm install mermaid@^11.0.0 --save
```

### 6.2 Update angular.json - Add Mermaid JS

Add to `projects.<project>.architect.build.options.scripts`:

```json
"node_modules/mermaid/dist/mermaid.min.js"
```

### 6.3 Initialize Mermaid in app.config.ts

```typescript
import mermaid from 'mermaid';

(window as any).mermaid = mermaid;
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark'
});
```

### 6.4 Use in Templates

```html
<markdown mermaid [src]="'path/to/diagram.md'"></markdown>
```

## Step 7: Install Optional Plugin - Copy to Clipboard

### 7.1 Install Clipboard.js

```bash
npm install clipboard@^2.0.11 --save
```

### 7.2 Update angular.json - Add Clipboard JS

Add to `projects.<project>.architect.build.options.scripts`:

```json
"node_modules/clipboard/dist/clipboard.min.js"
```

### 7.3 Use in Templates

```html
<markdown clipboard [src]="'path/to/file.ts'"></markdown>
```

## Step 8: Install Optional Plugin - KaTeX Math Rendering

### 8.1 Install KaTeX

```bash
npm install katex@^0.16.0 --save
```

### 8.2 Update angular.json - Add KaTeX CSS

Add to `projects.<project>.architect.build.options.styles`:

```json
"node_modules/katex/dist/katex.min.css"
```

### 8.3 Update angular.json - Add KaTeX JS

Add to `projects.<project>.architect.build.options.scripts`:

```json
"node_modules/katex/dist/katex.min.js",
"node_modules/katex/dist/contrib/auto-render.min.js"
```

### 8.4 Use in Templates

```html
<markdown katex [src]="'path/to/file.md'"></markdown>
```

## Step 9: Install Optional Plugin - Emoji Support

### 9.1 Install Emoji Toolkit

```bash
npm install emoji-toolkit@^10.0.0 --save
```

### 9.2 Update angular.json - Add Emoji JS

Add to `projects.<project>.architect.build.options.scripts`:

```json
"node_modules/emoji-toolkit/lib/js/joypixels.min.js"
```

### 9.3 Use in Templates

```html
<markdown emoji [data]="'I :heart: ngx-markdown'"></markdown>
```

## Step 10: Configure ngx-markdown Provider (Standalone)

### 10.1 Update app.config.ts

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideMarkdown, MERMAID_OPTIONS } from 'ngx-markdown';
import mermaid from 'mermaid';

// Initialize mermaid
(window as any).mermaid = mermaid;
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark'
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideMarkdown({
      mermaidOptions: {
        provide: MERMAID_OPTIONS,
        useValue: {
          darkMode: true,
          theme: 'base',
        },
      },
    }),
  ],
};
```

## Step 11: Use Markdown Component

### 11.1 Load from Remote File

```html
<markdown [src]="'path/to/file.md'"></markdown>
```

### 11.2 Load from Variable

```html
<markdown [data]="markdownContent"></markdown>
```

### 11.3 Load Static Content

````html
<markdown ngPreserveWhitespaces>
  # Heading

  ```typescript
  const x = 42;
````

</markdown>
```

## Verification Checklist

After completing all steps:

- [ ] `npm install` completes without errors
- [ ] `ng build` succeeds
- [ ] Markdown renders as HTML (not plain text)
- [ ] Code blocks display with syntax colors
- [ ] Mermaid diagrams render as visual elements
- [ ] No console errors or warnings
- [ ] All plugin features work as expected

## Full angular.json Example

Reference the complete styles and scripts array:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.scss",
              "node_modules/prismjs/themes/prism-okaidia.min.css",
              "node_modules/prismjs/plugins/line-numbers/prism-line-numbers.min.css",
              "node_modules/prismjs/plugins/line-highlight/prism-line-highlight.min.css",
              "node_modules/prismjs/plugins/command-line/prism-command-line.min.css",
              "node_modules/katex/dist/katex.min.css"
            ],
            "scripts": [
              "node_modules/prismjs/prism.js",
              "node_modules/prismjs/components/prism-typescript.min.js",
              "node_modules/prismjs/components/prism-bash.min.js",
              "node_modules/prismjs/components/prism-csharp.min.js",
              "node_modules/prismjs/plugins/line-numbers/prism-line-numbers.js",
              "node_modules/prismjs/plugins/line-highlight/prism-line-highlight.js",
              "node_modules/prismjs/plugins/command-line/prism-command-line.js",
              "node_modules/mermaid/dist/mermaid.min.js",
              "node_modules/clipboard/dist/clipboard.min.js",
              "node_modules/katex/dist/katex.min.js",
              "node_modules/katex/dist/contrib/auto-render.min.js",
              "node_modules/emoji-toolkit/lib/js/joypixels.min.js"
            ]
          }
        }
      }
    }
  }
}
```

## Minimal Setup (Core Only)

If you only need basic markdown rendering without plugins:

```bash
# Install
npm install ngx-markdown marked@^17.0.0 prismjs@^1.30.0 --save

# Update app.config.ts
import { provideMarkdown } from 'ngx-markdown';

export const appConfig: ApplicationConfig = {
  providers: [
    provideMarkdown(),
  ],
};

# Add to angular.json styles
"node_modules/prismjs/themes/prism-okaidia.min.css"

# Add to angular.json scripts
"node_modules/prismjs/prism.js",
"node_modules/prismjs/components/prism-typescript.min.js"
```

## Troubleshooting

**Markdown not rendering**: Check `provideMarkdown()` is in app.config.ts  
**No syntax colors**: Verify Prism CSS/JS in angular.json  
**Mermaid not working**: Check mermaid().initialize() is called before app bootstrap  
**Plugins not working**: Ensure CSS/JS files are listed in angular.json in correct order

## Audit Checklist — Diagnose Broken Setups

When checking an existing project for markdown/Prism issues, verify all of the following:

### 1. `angular.json` scripts must not be empty

```bash
# Check
grep -A5 '"scripts"' angular.json
```

If `"scripts": []`, Prism JS is not loaded — code blocks will render as plain text with no colours even if the CSS is present.

### 2. Prism CSS must be in `angular.json` styles — not injected dynamically

**Anti-pattern** (broken in production builds and dev server with base-href changes):

```typescript
// ❌ Never do this
async loadPrismJsTheme() {
  const link = document.createElement('link');
  link.href = 'node_modules/prismjs/themes/prism-okaidia.min.css'; // path not valid after build
  document.head.appendChild(link);
}
```

**Correct approach** — CSS in `angular.json` styles, no runtime injection needed:

```json
"styles": [
  "src/styles.scss",
  "node_modules/prismjs/themes/prism-okaidia.min.css"
]
```

If a `LibraryLoaderService` or similar service has a `loadPrismJsTheme()` / `loadPrismJsCss()` method, **remove it** and ensure the CSS is in `angular.json`. Also remove any calls to it from `markdown-renderer.component.ts`.

### 3. Scan pattern — check all demos at once

```powershell
Get-ChildItem "demos" -Recurse -Filter "angular.json" | ForEach-Object {
  Write-Host "=== $($_.FullName) ==="
  Select-String -Path $_.FullName -Pattern "prism|scripts" | Select-Object -ExpandProperty Line
}

# Find any library-loader with the anti-pattern
Get-ChildItem "demos" -Recurse -Filter "library-loader*" | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  if ($content -match "loadPrismJsTheme|loadPrismJsCss") {
    Write-Host "❌ Anti-pattern found: $($_.FullName)"
  }
}

# Find any renderers still calling the anti-pattern
Get-ChildItem "demos" -Recurse -Filter "markdown-renderer.component.ts" | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  if ($content -match "loadPrismJsTheme|loadPrismJsCss") {
    Write-Host "❌ Active call found: $($_.FullName)"
  }
}
```
