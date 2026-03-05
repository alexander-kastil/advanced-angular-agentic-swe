import { Injectable, inject } from '@angular/core';
import { AppConfig } from './app.config.model';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { SnackbarService } from '../shared/snackbar/snackbar.service';
import { firstValueFrom, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  http = inject(HttpClient);
  sbs = inject(SnackbarService);
  cfg: AppConfig = new AppConfig();

  async loadConfig() {
    try {
      this.cfg = await firstValueFrom(
        this.http.get<AppConfig>('/assets/config.json')
      );
    } catch (err) {
      this.sbs.displayAlert('Startup Err', 'config.json not found');
    }
  }
}
