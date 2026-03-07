
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { Skill } from './skills.model';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  readonly initialSkills = input<Skill[]>([], { alias: 'skills' });
  readonly skillsSaved = output<Skill[]>();
  readonly skillName = signal('');
  readonly skills = linkedSignal(() => this.initialSkills().map((skill) => ({ ...skill })));
  readonly hasSkills = computed(() => this.skills().length > 0);

  removeSkill(item: Skill): void {
    this.skills.update((skills) => skills.filter((skill) => skill.id !== item.id));
  }

  addSkill(): void {
    const name = this.skillName().trim();

    if (!name) {
      return;
    }

    const skill: Skill = {
      id: Math.max(0, ...this.skills().map((existingSkill) => existingSkill.id)) + 1,
      name,
      hours: 4,
      completed: false,
    };

    this.skills.update((skills) => [...skills, skill]);
    this.skillName.set('');
  }

  saveSkills(): void {
    this.skillsSaved.emit(this.skills());
  }

  updateSkillName(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    this.skillName.set(inputElement?.value ?? '');
  }
}