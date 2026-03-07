import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { SkillsComponent } from './app/skills/skills.component';

import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

// toggle comment to develop in the browser and create a custom element
// to build the element run: npm run build:elements
// to concatenate run: Get-Content .\dist\skills-list\browser\polyfills.js, .\dist\skills-list\browser\main.js | Set-Content .\dist\skills-list\browser\element.js

// bootstrapApplication(SkillsComponent, appConfig)
//   .catch((err) => console.error(err));

(async () => {
  const app = await createApplication({
    providers: [
      /* your global providers here */
    ],
  });

  const element = createCustomElement(SkillsComponent, {
    injector: app.injector,
  });
  customElements.define('skills-list', element);
})();