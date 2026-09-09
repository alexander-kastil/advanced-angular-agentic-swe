import { Component } from '@angular/core';
import { SecretLists } from './secret-lists/secret-lists';

@Component({
  imports: [SecretLists],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
