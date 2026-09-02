import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'auth',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [],
  imports: [RouterOutlet]
})
export class AuthComponent { }
