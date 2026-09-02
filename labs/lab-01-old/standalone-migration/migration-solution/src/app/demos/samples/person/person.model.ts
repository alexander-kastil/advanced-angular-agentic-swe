export class Person {
  id = 0;
  age = 0;
  name = '';
  email = '';
  wealth = '';
  gender: 'male' | 'female' | 'not set' = 'not set';
  lastname?: string;
  married?: boolean;
  imgUrl?: string;
  address?: Address = { street: '', city: '', postalCode: '' };
}

export class Address {
  street = '';
  city = '';
  postalCode = '';
}

export const wealthOptsValues = ['poor', 'rich', 'middle_class'];
