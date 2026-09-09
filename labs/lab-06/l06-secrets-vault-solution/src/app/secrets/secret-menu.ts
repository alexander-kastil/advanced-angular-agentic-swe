import { Component, input, output } from '@angular/core';
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@angular/aria/menu';
import { Secret } from './secret';

@Component({
  selector: 'app-secret-menu',
  imports: [Menu, MenuContent, MenuItem, MenuTrigger],
  template: `
    <button type="button" class="trigger" ngMenuTrigger [menu]="overflow"
            [attr.aria-label]="'Actions for ' + secret().name">...</button>

    <div ngMenu #overflow="ngMenu" class="menu">
      <ng-template ngMenuContent>
        <button type="button" ngMenuItem value="copy" (click)="copied.emit(secret())">Copy value</button>
        <button type="button" ngMenuItem value="versions" (click)="versionsRequested.emit(secret())">
          Show versions
        </button>
      </ng-template>
    </div>
  `,
  styles: `
    .trigger {
      background: none;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      color: var(--color-muted-foreground);
      cursor: pointer;
      font-size: 0.75rem;
      line-height: 1;
      padding: var(--space-sm) var(--space-md);
    }
    .trigger:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }
    .menu {
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      min-width: 160px;
      padding: var(--space-sm);
      position: absolute;
      z-index: 20;
    }
    .menu:not([data-visible='true']) {
      display: none;
    }
    [ngMenuItem] {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      font: inherit;
      padding: var(--space-md) var(--space-lg);
      text-align: left;
    }
    [ngMenuItem]:focus-visible,
    [ngMenuItem]:hover {
      background: var(--color-muted);
      outline: none;
    }
  `,
})
export class SecretMenu {
  readonly secret = input.required<Secret>();
  readonly copied = output<Secret>();
  readonly versionsRequested = output<Secret>();
}
