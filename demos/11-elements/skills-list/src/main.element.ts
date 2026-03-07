import { appConfigElement } from './app/app.config.element';
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
