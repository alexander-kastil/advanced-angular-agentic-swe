import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../../../auth/auth.store';

@Component({
  selector: 'app-protected-area',
  templateUrl: './protected-area.component.html',
  styleUrl: './protected-area.component.scss',
  imports: [RouterLink]
})
export class ProtectedAreaComponent {
  readonly auth = inject(AuthStore);
}
