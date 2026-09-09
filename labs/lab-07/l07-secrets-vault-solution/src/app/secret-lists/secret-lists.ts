import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SecretList } from './secret-list';

@Component({
  selector: 'app-secret-lists',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './secret-lists.html',
  styleUrl: './secret-lists.css',
})
export class SecretLists {
  readonly secretsLists = input.required<SecretList[]>();
  readonly vaultLists = input.required<SecretList[]>();
  readonly selectedListId = input<string | null>(null);
}
