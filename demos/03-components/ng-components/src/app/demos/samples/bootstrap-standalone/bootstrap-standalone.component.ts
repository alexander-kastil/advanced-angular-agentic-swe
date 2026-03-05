import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-bootstrap-standalone',
  templateUrl: './bootstrap-standalone.component.html',
  styleUrls: ['./bootstrap-standalone.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BootstrapStandaloneComponent { }

