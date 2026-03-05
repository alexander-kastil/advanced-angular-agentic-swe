import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  imports: [MatProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent { }
