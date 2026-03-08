import { appConfig } from './app/app.config';
import { SkillsComponent } from './app/skills/skills.component';

import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

(async () => {
  const app = await createApplication(appConfig);

  if (!customElements.get('skills-list')) {
    const element = createCustomElement(SkillsComponent, {
      injector: app.injector,
    });
    customElements.define('skills-list', element);
  }
})();
