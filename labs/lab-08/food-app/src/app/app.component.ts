import { Component, inject, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { MenuService } from './shared/menu/menu.service';
import { LoadingService } from './shared/loading/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Food App';
  mode: MatDrawerMode = 'side';
  ms = inject(MenuService);
  ls = inject(LoadingService);
  changeDetector = inject(ChangeDetectorRef);
  isLoading = this.ls.getLoading();

  constructor() {
    this.ms.sideNavPosition.subscribe((currentMode) => { this.mode = currentMode });
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  getWorbenchStyle() {
    let result = {};
    this.ms.sideNavVisible.subscribe((visible) => {
      result = visible
        ? {
          'padding-left': '10px',
        }
        : {};
    });
    return result;
  }
}
