import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expander',
  templateUrl: './expander.component.html',
  styleUrls: ['./expander.component.scss'],
})
export class ExpanderComponent implements OnInit {
  expanded = false;
  @Input() title = '';

  constructor() {}

  ngOnInit(): void {}

  toggleExpander() {
    this.expanded = !this.expanded;
  }
}
