import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  FormField,
  form,
  maxLength,
  required,
  submit,
  validateHttp,
} from '@angular/forms/signals';
import { Category } from './category';
import { Secret } from './secret';
import { UpdateSecret } from './update-secret';
import { SecretsStore } from '../store/secrets-store';

@Component({
  selector: 'app-secret-form',
  imports: [FormField],
  templateUrl: './secret-form.html',
  styleUrl: './secret-form.css',
})
export class SecretForm {
  private readonly store = inject(SecretsStore);

  readonly secret = input.required<Secret>();
  readonly categories = input.required<Category[]>();
  readonly saved = output<Secret>();

  readonly model = signal<UpdateSecret>({
    name: '',
    url: '',
    user: '',
    comment: '',
    mfa: false,
    categoryIds: [],
  });

  readonly serverError = signal<string | null>(null);
  readonly newCategory = signal('');

  readonly secretForm = form(this.model, (path) => {
    required(path.name, { message: 'A secret always has a name.' });
    maxLength(path.categoryIds, 3, { message: 'At most three categories.' });

    validateHttp(path.name, {
      request: (ctx) => {
        const name = ctx.value().trim();
        if (!name || name === this.secret().name) return undefined;
        return `/api/secrets/${encodeURIComponent(name)}?listId=${this.secret().listId}`;
      },
      onSuccess: () => ({ kind: 'nameTaken', message: 'That name is already used in this list.' }),
      onError: () => [],
      debounce: 400,
    });
  });

  readonly canSave = computed(() => this.secretForm().dirty() && this.secretForm().valid());

  private readonly sync = effect(() => this.model.set(this.toModel(this.secret())));

  async addCategory(): Promise<void> {
    const topic = this.newCategory().trim();
    if (!topic) return;

    const created = await this.store.addCategory(this.secret().listId, topic);
    this.newCategory.set('');
    this.toggleCategory(created.categoryId);
  }

  onNewCategory(event: Event): void {
    this.newCategory.set((event.target as HTMLInputElement).value);
  }

  toggleCategory(categoryId: string): void {
    this.model.update((current) => {
      const held = current.categoryIds.includes(categoryId);
      return {
        ...current,
        categoryIds: held
          ? current.categoryIds.filter((id) => id !== categoryId)
          : [...current.categoryIds, categoryId],
      };
    });
  }

  async save(): Promise<void> {
    this.serverError.set(null);

    await submit(this.secretForm, async (field) => {
      const value = field().value();
      const current = this.secret();

      try {
        const updated = await this.store.saveSecret(current, value);
        this.model.set(this.toModel(updated));
        this.saved.emit(updated);
        return undefined;
      } catch {
        this.serverError.set('The vault rejected the change. The name may have been taken meanwhile.');
        return undefined;
      }
    });
  }

  private toModel(secret: Secret): UpdateSecret {
    return {
      name: secret.name,
      url: secret.url ?? '',
      user: secret.user ?? '',
      comment: secret.comment ?? '',
      mfa: secret.mfa,
      categoryIds: [...secret.categoryIds],
    };
  }
}
