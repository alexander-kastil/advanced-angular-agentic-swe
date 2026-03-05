import { Injectable, signal } from '@angular/core';
import { SidebarActions } from './sidebar.actions';

@Injectable({ providedIn: 'root' })
export class SidePanelService {
  private commands = signal<SidebarActions>(SidebarActions.HIDE_MARKDOWN);
  readonly currentCommand = this.commands.asReadonly();

  getCommands() {
    return this.currentCommand;
  }

  triggerCmd(action: SidebarActions) {
    this.commands.set(action);
  }
}
