import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/loading/loading.component';
import { LoadingService } from './shared/loading/loading.service';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { SideNavService } from './shared/sidenav/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, NgStyle, MatSidenavModule, AsyncPipe, NgIf, NavbarComponent, SidebarComponent, LoadingComponent]
})
export class AppComponent {
  title = 'Food App';

  sideNavService = inject(SideNavService);
  ls = inject(LoadingService);
  changeDetector = inject(ChangeDetectorRef);
  isLoading = this.ls.getLoading();

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  getWorkbenchStyle() {
    let result = {};
    result = this.sideNavService.sideNavVisible()
      ? {
        'padding-left': '10px',
      }
      : {};
    return result;
  }
}
