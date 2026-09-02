import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TasksStore } from './tasks.store';

@Component({
  selector: 'app-store-entities',
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
    MatIconButton,
    MatIcon,
    MatCheckbox,
  ],
  providers: [TasksStore],
  templateUrl: './store-entities.component.html',
  styleUrl: './store-entities.component.scss',
})
export class StoreEntitiesComponent {
  protected store = inject(TasksStore);
  protected title = signal('');

  constructor() {
    this.store.seed();
  }

  add() {
    const title = this.title().trim();
    if (!title) return;
    this.store.addTask(title);
    this.title.set('');
  }
}
