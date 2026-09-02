import { Component, effect, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { Skill } from '../skill.model';
import { SkillsService } from '../skills.service';
import { SkillsStore } from '../skills.store';

@Component({
  selector: 'app-skills-edit',
  templateUrl: './skills-edit.component.html',
  styleUrls: ['./skills-edit.component.scss'],
  imports: [MatCardModule, MatFormField, MatLabel, MatInput, MatButtonModule,
    FormField, MatSlideToggle, MatCardActions]
})
export class SkillsEditComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(SkillsService);
  private store = inject(SkillsStore);
  private sns = inject(SnackbarService);

  readonly id = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id') || this.route.snapshot.data['id'] || 'new')
    ),
    { initialValue: this.route.snapshot.data['id'] || this.route.snapshot.paramMap.get('id') || 'new' }
  );

  readonly skillModel = signal<Skill>({ id: 0, name: '', completed: false });

  readonly skillForm = form(this.skillModel, (s) => {
    required(s.name, { message: 'Name is required' });
  });

  get isNew() { return this.id() === 'new' || this.id() === ''; }

  constructor() {
    effect(() => {
      const routeId = this.id();
      const idNum = Number(routeId);

      if (routeId === 'new' || routeId === '') {
        this.skillModel.set({ id: 0, name: '', completed: false });
      } else if (idNum > 0) {
        const known = this.store.entityMap()[idNum];
        if (known) {
          this.skillModel.set({ ...known });
        } else {
          this.service.getSkill(idNum).subscribe((data) => this.skillModel.set(data));
        }
      }
    });
  }

  saveSkill() {
    submit(this.skillForm, async () => {
      const skill = this.skillModel();
      if (this.isNew) {
        this.store.add(skill);
      } else {
        this.store.update(skill);
      }
      this.sns.displayAlert('Skills', this.isNew ? 'Skill added' : 'Skill updated');
      this.router.navigate(['/skills']);
    });
  }

  doCancel() {
    this.router.navigate(['/skills']);
  }
}
