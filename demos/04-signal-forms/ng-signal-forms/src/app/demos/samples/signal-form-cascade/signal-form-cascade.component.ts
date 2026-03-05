import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, applyEach } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { BorderDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { SkillItem, SkillProfile } from './skill-profile.model';

@Component({
  selector: 'app-reactive-cascade',
  templateUrl: './signal-form-cascade.component.html',
  styleUrls: ['./signal-form-cascade.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    FormField,
    MatFormField,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatButton,
    BorderDirective,
    MarkdownRendererComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactiveCascadeComponent {
  readonly selectValues = [
    { type: 'Frameworks', values: ['Angular', 'React', '.NET Core', 'Spring'] },
    { type: 'Languages', values: ['TypeScript', 'JavaScript', 'C#', 'Java', 'Python'] },
    { type: 'Cloud', values: ['Azure', 'AWS', 'Google'] },
  ];

  profileModel = signal<SkillProfile>({
    firstName: '',
    lastName: '',
    skills: [{ techType: '', techValues: '' }],
  });

  profileForm = form(this.profileModel, (s) => {
    applyEach(s.skills, (_item) => { });
  });

  getCriteria(techType: string): string[] {
    return this.selectValues.find((s) => s.type === techType)?.values ?? [];
  }

  addSkill(): void {
    this.profileModel.update((m) => ({
      ...m,
      skills: [...m.skills, { techType: '', techValues: '' }],
    }));
  }

  saveForm(): void {
    console.log('form saves:', this.profileModel());
  }
}

