import { Component, OnInit } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    imports: [MatProgressBar]
})
export class LoadingComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
