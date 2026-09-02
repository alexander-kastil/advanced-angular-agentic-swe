import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-expander-template',
    templateUrl: './expander-template.component.html',
    styleUrls: ['./expander-template.component.scss'],
    standalone: true,
    imports: [NgTemplateOutlet],
})
export class ExpanderTemplateComponent implements OnInit {
  @Input() title = '';
  @Input() content: TemplateRef<any> | null = null;
  expanded = false;

  constructor() {}

  ngOnInit(): void {}

  toggleExpander() {
    this.expanded = !this.expanded;
  }
}
