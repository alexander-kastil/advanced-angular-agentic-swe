import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PresenterEditComponent } from './presenter-edit/presenter-edit.component';
import { PresenterListComponent } from './presenter-list/presenter-list.component';
import { PersonStore } from './person.store';

@Component({
  selector: 'app-container-presenter',
  templateUrl: './container-presenter.component.html',
  styleUrls: ['./container-presenter.component.scss'],
  imports: [PresenterListComponent, PresenterEditComponent],
  providers: [PersonStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerPresenterComponent {
  protected store = inject(PersonStore);
}
