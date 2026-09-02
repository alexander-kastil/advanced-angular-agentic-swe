import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';

declare var window: Window;

@Component({
  selector: 'app-err-page',
  templateUrl: './err-page.component.html',
  styleUrls: ['./err-page.component.scss'],
  imports: [JsonPipe],
})
export class ErrPageComponent {
  error = window.history.state;
}
