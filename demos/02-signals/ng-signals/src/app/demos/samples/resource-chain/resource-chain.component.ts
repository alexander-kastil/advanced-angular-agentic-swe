import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { environment } from '../../../../environments/environment';
import { BorderDirective } from '../../../shared/formatting/formatting-directives';
import { Skill } from '../../../skills/skill.model';

@Component({
  selector: 'app-resource-chain',
  imports: [MatButton, BorderDirective],
  templateUrl: './resource-chain.component.html',
  styleUrl: './resource-chain.component.scss',
})
export class ResourceChainComponent {
  readonly index = signal(0);

  readonly skills = httpResource<Skill[]>(() => `${environment.api}skills`, {
    defaultValue: [],
    debugName: 'skills',
  });

  readonly selected = httpResource<Skill>(
    ({ chain }) => {
      const list = chain(this.skills);
      if (list.length === 0) {
        return undefined;
      }
      return `${environment.api}skills/${list[this.index() % list.length].id}`;
    },
    { defaultValue: { id: 0, name: '', completed: false }, debugName: 'selected' },
  );

  readonly related = httpResource<Skill[]>(
    ({ chain }) => `${environment.api}skills?completed=${chain(this.selected).completed}`,
    { defaultValue: [], debugName: 'related' },
  );

  next() {
    this.index.update((i) => i + 1);
  }

  reloadRoot() {
    this.skills.reload();
  }
}
