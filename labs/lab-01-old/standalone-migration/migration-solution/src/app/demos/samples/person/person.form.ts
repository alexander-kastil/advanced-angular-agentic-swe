import { FormControl, FormGroup } from '@angular/forms';

//not necessary but makes the form type reusable
export interface PersonFormType {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  age: FormControl<number | null>;
  email: FormControl<string | null>;
  gender: FormControl<'male' | 'female' | 'not set' | null>;
  wealth: FormControl<string | null>;
  address?: FormGroup<{
    street: FormControl<string | null>;
    city: FormControl<string | null>;
    postalCode: FormControl<string | null>;
  }>;
}
