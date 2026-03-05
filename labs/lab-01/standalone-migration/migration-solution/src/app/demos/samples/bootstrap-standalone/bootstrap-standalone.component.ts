import { Component, OnInit } from '@angular/core';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-bootstrap-standalone',
    templateUrl: './bootstrap-standalone.component.html',
    styleUrls: ['./bootstrap-standalone.component.scss'],
    standalone: true,
    imports: [MarkdownRendererComponent]
})
export class BootstrapStandaloneComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
