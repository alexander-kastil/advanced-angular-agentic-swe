import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TasksStore } from './tasks.store';

@Component({
  selector: 'app-store-entities',
  imports: [FormsModule],
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
