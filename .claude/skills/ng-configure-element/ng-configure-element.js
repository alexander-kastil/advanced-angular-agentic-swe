#!/usr/bin/env node

/**
 * ng-configure-element
 *
 * Configures an Angular project for Angular Elements distribution.
 * Sets up dual configurations: one for development/testing with zoneless,
 * and one for element distribution without zoneless.
 *
 * Usage:
 *   node scripts/ng-configure-element.js <project-path>
 *
 * Example:
 *   node scripts/ng-configure-element.js demos/11-elements/skills-list
 */

const fs = require('fs');
const path = require('path');

function upsertJsonFile(filePath, updater) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(content);
  const updated = updater(json);
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2) + '\n');
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Error: Project path required');
  console.log('\nUsage: node scripts/ng-configure-element.js <project-path>');
  console.log('\nExample:');
  console.log('  node scripts/ng-configure-element.js demos/11-elements/skills-list');
  process.exit(1);
}

const projectPath = args[0];
const projectRoot = path.resolve(projectPath);

// Verify it's an Angular project
if (!fs.existsSync(path.join(projectRoot, 'angular.json'))) {
  console.error(`❌ Error: No angular.json found at ${projectRoot}`);
  process.exit(1);
}

console.log(`🔧 Configuring Angular Elements for: ${projectPath}\n`);

const srcPath = path.join(projectRoot, 'src');
const appPath = path.join(srcPath, 'app');
const packageJsonPath = path.join(projectRoot, 'package.json');
const angularJsonPath = path.join(projectRoot, 'angular.json');
const tsconfigAppPath = path.join(projectRoot, 'tsconfig.app.json');

// 1. Create app.config.element.ts
const appConfigElementContent = `import { ApplicationConfig } from '@angular/core';

export const appConfigElement: ApplicationConfig = {
  providers: []
};
`;

fs.writeFileSync(path.join(appPath, 'app.config.element.ts'), appConfigElementContent);
console.log('✓ Created app.config.element.ts');

// 2. Create main.element.ts
const mainElementContent = `import { appConfigElement } from './app/app.config.element';
import { SkillsComponent } from './app/skills/skills.component';

import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

(async () => {
  const app = await createApplication(appConfigElement);

  if (!customElements.get('skills-list')) {
    const element = createCustomElement(SkillsComponent, {
      injector: app.injector,
    });
    customElements.define('skills-list', element);
  }
})();
`;

fs.writeFileSync(path.join(srcPath, 'main.element.ts'), mainElementContent);
console.log('✓ Created main.element.ts');

// 3. Update angular.json
upsertJsonFile(angularJsonPath, (angularJson) => {
  const projectName = Object.keys(angularJson.projects ?? {})[0];

  if (!projectName) {
    throw new Error('No Angular project found in angular.json');
  }

  const project = angularJson.projects[projectName];
  const build = project.architect?.build;
  const serve = project.architect?.serve;

  if (!build || !serve) {
    throw new Error('Project is missing build or serve targets');
  }

  build.configurations = build.configurations ?? {};
  build.configurations.element = {
    ...(build.configurations.element ?? {}),
    browser: 'src/main.element.ts'
  };

  serve.configurations = serve.configurations ?? {};
  serve.configurations.element = {
    ...(serve.configurations.element ?? {}),
    buildTarget: `${projectName}:build:element,development`
  };

  return angularJson;
});
console.log('✓ Updated angular.json with element build and serve configurations');

// 4. Update tsconfig.app.json
upsertJsonFile(tsconfigAppPath, (tsconfig) => {
  const files = new Set(tsconfig.files ?? []);
  files.add('src/main.ts');
  files.add('src/main.element.ts');
  tsconfig.files = Array.from(files);

  const include = new Set(tsconfig.include ?? []);
  include.add('src/app/**/*.ts');
  include.add('src/**/*.d.ts');
  tsconfig.include = Array.from(include);

  return tsconfig;
});
console.log('✓ Updated tsconfig.app.json for the element entry point');

// 5. Update package.json
upsertJsonFile(packageJsonPath, (packageJson) => {
  packageJson.scripts = packageJson.scripts ?? {};
  packageJson.scripts['serve:element'] = 'ng serve --configuration element --open';
  packageJson.scripts['build:element'] = 'ng build --configuration element,production --output-hashing none';
  return packageJson;
});
console.log('✓ Updated package.json with serve:element and build:element scripts');

console.log('\n✅ Angular Elements configuration complete!\n');
console.log('📋 Available commands:');
console.log('  npm start               → Dev server with zoneless (test Angular app)');
console.log('  npm run serve:element   → Dev server without zoneless (preview element)');
console.log('  npm run build:element   → Build web component for distribution\n');
console.log('📚 Configuration files:');
console.log('  src/app/app.config.ts            → Default config (with zoneless)');
console.log('  src/app/app.config.element.ts    → Element config (without zoneless)');
console.log('  src/main.ts                      → Default entry point');
console.log('  src/main.element.ts              → Element entry point');
console.log('  angular.json                     → Element build and serve configurations');
console.log('  tsconfig.app.json                → TypeScript entry-point inclusion\n');
