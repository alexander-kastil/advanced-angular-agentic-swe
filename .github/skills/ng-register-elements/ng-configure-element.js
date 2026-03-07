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
const scriptsPath = path.join(projectRoot, 'scripts');
const packageJsonPath = path.join(projectRoot, 'package.json');

// 1. Create scripts directory if it doesn't exist
if (!fs.existsSync(scriptsPath)) {
  fs.mkdirSync(scriptsPath, { recursive: true });
  console.log('✓ Created scripts directory');
}

// 2. Create app.config.element.ts
const appConfigElementContent = `import { ApplicationConfig } from '@angular/core';

export const appConfigElement: ApplicationConfig = {
  providers: []
};
`;

fs.writeFileSync(path.join(appPath, 'app.config.element.ts'), appConfigElementContent);
console.log('✓ Created app.config.element.ts');

// 3. Create main.element.ts
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

// 4. Create serve-element.sh
const serveElementScript = `#!/bin/bash

set -e

MAIN_FILE="src/main.ts"
MAIN_BACKUP="src/main.ts.bak"
ELEMENT_MAIN="src/main.element.ts"

echo "Starting element dev server (without zoneless)..."

# Backup original main.ts
cp "$MAIN_FILE" "$MAIN_BACKUP"

# Use element main.ts
cp "$ELEMENT_MAIN" "$MAIN_FILE"

# Trap to restore on exit (Ctrl+C)
trap "mv '$MAIN_BACKUP' '$MAIN_FILE'; echo 'Element server stopped. Restored main.ts'" EXIT

# Run the dev server
ng serve --open
`;

fs.writeFileSync(path.join(scriptsPath, 'serve-element.sh'), serveElementScript);
fs.chmodSync(path.join(scriptsPath, 'serve-element.sh'), '755');
console.log('✓ Created scripts/serve-element.sh');

// 5. Create build-element.sh
const buildElementScript = `#!/bin/bash

set -e

MAIN_FILE="src/main.ts"
MAIN_BACKUP="src/main.ts.bak"
ELEMENT_MAIN="src/main.element.ts"

echo "Building Angular Element (without zoneless)..."

# Backup original main.ts
cp "$MAIN_FILE" "$MAIN_BACKUP"

# Use element main.ts for build
cp "$ELEMENT_MAIN" "$MAIN_FILE"

# Run the build
ng build -c production --output-hashing none

# Restore original main.ts
mv "$MAIN_BACKUP" "$MAIN_FILE"

echo "Element build complete! Output is in dist/<project-name>/"
`;

fs.writeFileSync(path.join(scriptsPath, 'build-element.sh'), buildElementScript);
fs.chmodSync(path.join(scriptsPath, 'build-element.sh'), '755');
console.log('✓ Created scripts/build-element.sh');

// 6. Update package.json
const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
const packageJson = JSON.parse(packageJsonContent);

// Add/update scripts
if (!packageJson.scripts) {
  packageJson.scripts = {};
}

packageJson.scripts['serve:element'] = 'bash scripts/serve-element.sh';
packageJson.scripts['build:element'] = 'bash scripts/build-element.sh';

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
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
console.log('  scripts/serve-element.sh         → Element dev server');
console.log('  scripts/build-element.sh         → Element build script\n');
