import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { ExpanderTemplateComponent } from './expander-template/expander-template.component';
import { ClockComponent } from './clock/clock.component';
import { ExpanderComponent } from './expander-content/expander.component';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-template-vs-container',
    templateUrl: './template-vs-container.component.html',
    styleUrls: ['./template-vs-container.component.scss'],
    standalone: true,
    imports: [
        MarkdownRendererComponent,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        ExpanderComponent,
        ClockComponent,
        ExpanderTemplateComponent,
        AsyncPipe,
    ],
})
export class TemplateVsContainerComponent implements OnInit {
  currentTime = interval(100).pipe(map(() => new Date().toTimeString()));

  constructor() { }

  ngOnInit(): void { }
}
