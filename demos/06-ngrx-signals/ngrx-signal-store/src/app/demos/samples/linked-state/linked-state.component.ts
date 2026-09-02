import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogStore } from './catalog.store';

@Component({
  selector: 'app-linked-state',
  imports: [FormsModule],
  providers: [CatalogStore],
  templateUrl: './linked-state.component.html',
  styleUrl: './linked-state.component.scss',
})
export class LinkedStateComponent {
  protected store = inject(CatalogStore);
}
