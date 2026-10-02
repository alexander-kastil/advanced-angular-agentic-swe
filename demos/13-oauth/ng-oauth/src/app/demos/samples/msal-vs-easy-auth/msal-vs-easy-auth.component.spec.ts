import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { MsalVsEasyAuthComponent } from './msal-vs-easy-auth.component';

describe('MsalVsEasyAuthComponent', () => {
  it('reads the name and roles from the principal header', () => {
    const component = TestBed.createComponent(MsalVsEasyAuthComponent).componentInstance;

    expect(component.userName()).toBe('Ada Lovelace');
    expect(component.roles()).toEqual(['Orders.Read']);
  });

  it('reports a header that is not base64 json', () => {
    const component = TestBed.createComponent(MsalVsEasyAuthComponent).componentInstance;

    component.setHeader('%%%');

    expect(component.principal().error).not.toBe('');
  });
});
