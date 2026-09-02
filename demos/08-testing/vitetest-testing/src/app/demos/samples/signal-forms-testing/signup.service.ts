import { Injectable } from '@angular/core';

export interface Signup {
  email: string;
  password: string;
  confirm: string;
  age: number;
}

@Injectable({ providedIn: 'root' })
export class SignupService {
  private readonly taken = ['taken@demo.io'];
  readonly accepted: Signup[] = [];

  async register(signup: Signup): Promise<'ok' | 'email-taken'> {
    if (this.taken.includes(signup.email)) {
      return 'email-taken';
    }
    this.accepted.push(signup);
    return 'ok';
  }
}
