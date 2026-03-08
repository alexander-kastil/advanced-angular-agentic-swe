# Angular Elements Demo

An Angular Element is an Angular component packaged as a standard browser custom element. That means it behaves like a reusable web control: you place it on a page as an HTML tag, pass data in, listen for events out, and use it inside Angular or non-Angular applications.

## Quick Start

Use the configured demo project in [skills-list](d:/git-classes/advanced-angular-agentic-swe/demos/11-elements/skills-list):

```bash
cd skills-list
```

## Scripts

| Script                  | Purpose                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `npm start`             | Runs the normal Angular dev server for the app entry point. Use this while developing the component inside the Angular app. |
| `npm run build`         | Creates a standard Angular production build of the demo application.                                                        |
| `npm run serve:element` | Starts the dev server with the element entry point instead of the normal app entry point.                                   |
| `npm run build:element` | Builds the distributable web component by using the element entry point in the Angular build configuration.                 |

## What This Demo Shows

The `skills-list` demo shows how to expose a standalone Angular component as a browser custom element while keeping a normal Angular development mode. It uses modern Angular patterns such as signals, `input()`, `output()`, and native control flow.

## Key Files

- `src/app/skills/skills.component.ts`: The custom element component
- `src/app/app.config.ts`: Default app configuration
- `src/app/app.config.element.ts`: Element-specific configuration
- `src/main.ts`: Normal application entry point
- `src/main.element.ts`: Custom-element entry point
- `angular.json`: Build and serve configurations for normal app mode and element mode

## Output

`npm run build:element` writes the production element bundle to `dist/skills-list/browser/`.

To embed it in another app, load the built script and place the custom element on the page:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body>
  <skills-list></skills-list>
  <script src="dist/skills-list/browser/main.js"></script>
</body>
</html>
```

## Resources

- [Angular Elements Guide](https://angular.dev/guide/elements)
- [Web Components](https://developer.mozilla.org/en-US/docs/web/web_components)
- [Signals in Angular](https://angular.dev/guide/signals)
- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
