export class Person {
    id = 0;
    age = 0;
    name = '';
    email = '';
    wealth = '';
    state?: 'Satisfied' | 'Unsatisfied' | 'ReadyForRevolution';
    lastName?: string;
    gender: 'male' | 'female' | 'not set' = 'male';
    married?: boolean;
    imgUrl?: string;
    address?: Address;
}

export class Address {
    street = '';
    city = '';
    postalCode = '';
}

export const wealthOptsValues = ['poor', 'rich', 'middle_class'];
