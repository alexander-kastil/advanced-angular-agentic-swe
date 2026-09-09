import { Component, input, output } from '@angular/core';
import { SecretList } from './secret-list';

@Component({
  selector: 'app-secret-lists',
  templateUrl: './secret-lists.html',
  styleUrl: './secret-lists.css',
})
export class SecretLists {
  readonly secretsLists = input.required<SecretList[]>();
  readonly vaultLists = input.required<SecretList[]>();
  readonly selectedListId = input<string | null>(null);
  readonly listSelected = output<string>();
}
