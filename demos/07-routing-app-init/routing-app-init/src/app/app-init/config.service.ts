import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SnackbarService } from '../shared/snackbar/snackbar.service';
import { AppConfig } from './app.config.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private http = inject(HttpClient);
  private sbs = inject(SnackbarService);

  readonly config = signal<AppConfig>(new AppConfig());

  async loadConfig() {
    try {
      this.config.set(await firstValueFrom(this.http.get<AppConfig>('assets/config.json')));
    } catch {
      this.sbs.displayAlert('Startup Err', 'config.json not found');
    }
  }
}
