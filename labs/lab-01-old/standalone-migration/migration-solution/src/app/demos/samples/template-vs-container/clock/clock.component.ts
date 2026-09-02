import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-clock',
    templateUrl: './clock.component.html',
    styleUrls: ['./clock.component.scss'],
    standalone: true,
})
export class ClockComponent implements OnInit {
  time = '';
  constructor() {}

  ngOnInit(): void {
    this.time = new Date().toTimeString();
  }
}
