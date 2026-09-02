import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { AppSettingsStore, Density } from './app-settings.store';

@Component({
  selector: 'app-app-state',
  imports: [
    FormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatSlideToggle,
    MatButton,
    MatButtonToggleGroup,
    MatButtonToggle,
  ],
  providers: [AppSettingsStore],
  templateUrl: './app-state.component.html',
  styleUrls: ['./app-state.component.scss'],
})
export class AppStateComponent {
  protected store = inject(AppSettingsStore);
  protected readonly densities: Density[] = ['compact', 'comfortable', 'spacious'];
}
