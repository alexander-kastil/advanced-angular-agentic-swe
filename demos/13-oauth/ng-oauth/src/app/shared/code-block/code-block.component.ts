import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-code-block',
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.scss'
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
  readonly label = input('');

  readonly state = signal<'idle' | 'copied' | 'failed'>('idle');

  async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.state.set('copied');
    } catch {
      this.state.set('failed');
    }
    setTimeout(() => this.state.set('idle'), 1500);
  }
}
