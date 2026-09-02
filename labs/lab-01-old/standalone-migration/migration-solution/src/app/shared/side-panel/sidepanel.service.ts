import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SidebarActions } from './sidebar.actions';

@Injectable({ providedIn: 'root' })
export class SidePanelService {
  private commands: BehaviorSubject<SidebarActions> =
    new BehaviorSubject<SidebarActions>(SidebarActions.HIDE_MARKDOWN);

  getCommands() {
    return this.commands;
  }

  triggerCmd(action: SidebarActions) {
    this.commands.next(action);
  }
}
