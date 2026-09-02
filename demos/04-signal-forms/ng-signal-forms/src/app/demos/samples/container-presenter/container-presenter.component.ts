import { Component, inject } from '@angular/core';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { PresenterEditComponent } from './presenter-edit/presenter-edit.component';
import { PresenterListComponent } from './presenter-list/presenter-list.component';
import { PersonStore } from './person.store';

@Component({
  selector: 'app-container-presenter',
  templateUrl: './container-presenter.component.html',
  styleUrls: ['./container-presenter.component.scss'],
  imports: [MarkdownRendererComponent, PresenterListComponent, PresenterEditComponent],
  providers: [PersonStore]
})
export class ContainerPresenterComponent {
  protected store = inject(PersonStore);
}
