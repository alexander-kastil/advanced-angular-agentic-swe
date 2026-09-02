import { ChangeDetectionStrategy, Component, effect, inject, signal, Signal } from '@angular/core';
import { form, FormField, required, email, validate, validateAsync, min, max } from '@angular/forms/signals';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MarkdownRendererComponent } from 'src/app/shared/markdown-renderer/markdown-renderer.component';
import { ColumnDirective } from 'src/app/shared/ux-lib/formatting/formatting-directives';
import { PersonService } from '../person/person.service';

interface PersonFormModel {
  name: string;
  age: number;
  gender: string;
  email: string;
  wealth: string;
}

@Component({
  selector: 'app-reactive-validation',
  templateUrl: './signal-form-validators.component.html',
  styleUrls: ['./signal-form-validators.component.scss'],
  imports: [
    MatCardModule,
    ColumnDirective,
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatButtonModule,
    MarkdownRendererComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactiveValidationComponent {
  private ps = inject(PersonService);
  wealthOpts = ['poor', 'rich', 'middle_class'];

  personModel = signal<PersonFormModel>({ name: '', age: 0, gender: 'not set', email: '', wealth: '' });

  private createEmailResource = (emailSignal: Signal<string | undefined>) =>
    rxResource({
      params: () => emailSignal(),
      stream: ({ params: mail }) => this.ps.checkMailExists(mail ?? ''),
    });

  personForm = form(this.personModel, (s) => {
    required(s.name, { message: 'Name is required' });
    validate(s.name, ({ value }) =>
      value() === 'Hugo' ? { kind: 'invalidName', message: 'The name Hugo is not allowed' } : null
    );
    min(s.age, 18, { message: 'Person must be at least 18' });
    max(s.age, 99, { message: 'Person must be at most 99' });
    required(s.email, { message: 'Email is required' });
    email(s.email, { message: 'Invalid email address' });
    validateAsync(s.email, {
      params: ({ value }) => value() ?? undefined,
      factory: this.createEmailResource,
      onSuccess: (exists) =>
        exists ? { kind: 'mailExists', message: 'Sorry this mail is already registered' } : null,
      onError: () => ({ kind: 'serverError', message: 'Could not verify email' }),
    });
  });

  constructor() {
    effect(() => {
      this.ps.getPerson().subscribe((p) => {
        this.personModel.update((m) => ({ ...m, name: p.name, age: p.age, email: p.email, gender: p.gender, wealth: p.wealth }));
      });
    });
  }

  savePerson(): void {
    this.ps.save(this.personModel() as any);
  }
}

