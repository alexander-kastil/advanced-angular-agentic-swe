import { Component } from '@angular/core';

@Component({
  selector: 'app-broken-panel',
  template: `<p>You will never see this: the resolver fails before activation.</p>`,
})
export class BrokenPanelComponent {}
