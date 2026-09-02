import { Component, computed, signal } from '@angular/core';
import { applyEach, disabled, form, FormField, required, submit } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { BorderDirective, ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { skillCatalog, SkillProfile } from './skill-profile.model';

@Component({
  selector: 'app-reactive-cascade',
  templateUrl: './cascade.component.html',
  styleUrls: ['./cascade.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    FormField,
    MatFormField,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatButton,
    BorderDirective,
    ColumnDirective,
    MarkdownRendererComponent
  ]
})
export class ReactiveCascadeComponent {
  readonly categories = skillCatalog;

  profileModel = signal<SkillProfile>({
    firstName: '',
    lastName: '',
    skills: [{ techType: '', techValues: '' }],
  });

  profileForm = form(this.profileModel, (s) => {
    required(s.firstName, { message: 'First name is required' });
    required(s.lastName, { message: 'Last name is required' });

    applyEach(s.skills, (skill) => {
      required(skill.techType, { message: 'Pick a category' });
      disabled(skill.techValues, ({ valueOf }) => !valueOf(skill.techType));
      required(skill.techValues, {
        message: 'Pick a technology',
        when: ({ valueOf }) => !!valueOf(skill.techType),
      });
    });
  });

  summary = computed(() =>
    this.profileModel()
      .skills.filter((s) => s.techType && s.techValues)
      .map((s) => `${s.techType}: ${s.techValues}`)
  );

  optionsFor(category: string): string[] {
    return this.categories.find((c) => c.type === category)?.values ?? [];
  }

  onCategoryChange(index: number): void {
    this.profileForm.skills[index].techValues().value.set('');
  }

  addSkill(): void {
    this.profileModel.update((m) => ({
      ...m,
      skills: [...m.skills, { techType: '', techValues: '' }],
    }));
  }

  removeSkill(index: number): void {
    this.profileModel.update((m) => ({
      ...m,
      skills: m.skills.filter((_, i) => i !== index),
    }));
  }

  saveForm(): void {
    submit(this.profileForm, async () => console.log('profile:', this.profileModel()));
  }
}
