import { Injectable, computed, signal } from '@angular/core';
import { SidebarActions } from './sidebar.actions';

@Injectable({ providedIn: 'root' })
export class SidePanelService {
  private commands = signal<SidebarActions>(SidebarActions.HIDE_MARKDOWN);

  getCommands() {
    return computed(() => this.commands());
  }

  triggerCmd(action: SidebarActions) {
    this.commands.set(action);
  }
}
