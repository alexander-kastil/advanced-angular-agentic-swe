import { Component } from '@angular/core';
import { CodePanelComponent } from '../../../shared/code-panel/code-panel.component';

interface Stage {
  title: string;
  detail: string;
  code: string;
}

@Component({
  selector: 'app-node-app-engine',
  imports: [CodePanelComponent],
  templateUrl: './node-app-engine.component.html',
  styleUrl: './node-app-engine.component.scss',
})
export class NodeAppEngineComponent {
  readonly stages: Stage[] = [
    {
      title: '1. Static files first',
      detail:
        'Everything the browser build emitted is served straight from disk. index: false keeps express.static from answering / with the CSR shell, which would bypass rendering completely.',
      code: `const browserDistFolder = join(import.meta.dirname, '../browser');

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);`,
    },
    {
      title: '2. Angular handles the rest',
      detail:
        'AngularNodeAppEngine.handle() returns a web Response for a matched route, or undefined so the next middleware runs. Express 5 removed the bare "*" path, so this is plain app.use() with no path argument.',
      code: `const angularApp = new AngularNodeAppEngine();

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});`,
    },
    {
      title: '3. Listen only when run directly',
      detail:
        'isMainModule keeps the listener out of the way when a serverless host imports the module instead of executing it.',
      code: `if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(\`Node Express server listening on http://localhost:\${port}\`);
  });
}`,
    },
    {
      title: '4. Export a request handler',
      detail:
        'createNodeRequestHandler wraps the Express app so Firebase, Cloud Run or any Node host can invoke it per request.',
      code: `export const reqHandler = createNodeRequestHandler(app);`,
    },
  ];

  readonly imports = `import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';`;

  readonly retired = `// Angular 17 shape, gone in 22
import { CommonEngine } from '@angular/ssr/node';

const commonEngine = new CommonEngine();
server.get('*', (req, res, next) => {
  commonEngine
    .render({ bootstrap, documentFilePath, url, publicPath, providers: [...] })
    .then((html) => res.send(html))
    .catch(next);
});`;

  readonly probes = [
    { path: '/', expect: 'prerendered file, served by express.static' },
    { path: '/food/2', expect: 'prerendered file for a known id' },
    { path: '/food/99', expect: 'rendered per request by the fallback' },
    { path: '/demos/node-app-engine', expect: 'rendered per request, RenderMode.Server' },
    { path: '/assets/images/falaffel.jpg', expect: 'static asset, never reaches Angular' },
  ];

  readonly verify = `npm run build
node dist/food-shop-ssr/server/server.mjs
curl -s -o /dev/null -w '%{http_code} %{size_download}\n' http://localhost:4000/food/99`;
}
