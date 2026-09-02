import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MarkdownRendererModule } from 'src/app/shared/markdown-renderer/markdown-renderer.module';
import { BoxedDirective } from 'src/app/shared/ux-lib/formatting/formatting-directives';

@Component({
  selector: 'app-control-flow',
  standalone: true,
  imports: [MarkdownRendererModule, MatSlideToggleModule, ReactiveFormsModule, BoxedDirective],
  templateUrl: './control-flow.component.html',
  styleUrl: './control-flow.component.scss'
})
export class ControlFlowComponent {

  fcDisplay = new FormControl(true);
  dogs = ["Flora", "Cleo", "Soi", "Giro"]
  loaded = false;

  ngOnInit() {
    setTimeout(() => {
      this.loaded = true;
    }, 3000);
  }

}
