import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SimpleMessageService {

  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  delete(msg: string) {
    this.messages = this.messages.filter((item) => item != msg);
  }

  clear() {
    this.messages = [];
  }
}
