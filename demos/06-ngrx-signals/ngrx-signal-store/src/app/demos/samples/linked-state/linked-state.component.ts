import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { CatalogStore } from './catalog.store';

@Component({
  selector: 'app-linked-state',
  imports: [
    FormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatSelectionList,
    MatListOption,
  ],
  providers: [CatalogStore],
  templateUrl: './linked-state.component.html',
  styleUrl: './linked-state.component.scss',
})
export class LinkedStateComponent {
  protected store = inject(CatalogStore);
}
