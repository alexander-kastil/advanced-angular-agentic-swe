import { Directive, input, signal } from '@angular/core';

@Directive({
  selector: '[appCopyToClipboard]',
  host: {
    '(click)': 'copy()',
    '[attr.data-copied]': 'copied()',
  },
})
export class CopyToClipboard {
  readonly appCopyToClipboard = input<string | null>(null);
  readonly copied = signal(false);

  async copy(): Promise<void> {
    const value = this.appCopyToClipboard();
    if (!value) return;

    // A denied clipboard permission must not surface as an unhandled rejection.
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }

    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }
}
