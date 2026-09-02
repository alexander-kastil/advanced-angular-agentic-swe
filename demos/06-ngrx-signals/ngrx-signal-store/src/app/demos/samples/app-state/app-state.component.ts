import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SlideToggleComponent } from '../../../shared/slide-toggle/slide-toggle.component';
import { AppSettingsStore, Density } from './app-settings.store';

@Component({
  selector: 'app-app-state',
  imports: [FormsModule, SlideToggleComponent],
  providers: [AppSettingsStore],
  templateUrl: './app-state.component.html',
  styleUrls: ['./app-state.component.scss'],
})
export class AppStateComponent {
  protected store = inject(AppSettingsStore);
  protected readonly densities: Density[] = ['compact', 'comfortable', 'spacious'];
}
