export type FieldKind = 'text' | 'email' | 'number' | 'date';

export interface FieldDescriptor {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
}

export interface JsonFormDescriptor {
  id: string;
  title: string;
  fields: FieldDescriptor[];
}

export const FORM_DESCRIPTORS: JsonFormDescriptor[] = [
  {
    id: 'contact',
    title: 'Contact Request',
    fields: [
      { key: 'fullName', label: 'Full name', kind: 'text', required: true, minLength: 3, maxLength: 40 },
      { key: 'email', label: 'Email', kind: 'email', required: true },
      {
        key: 'phone',
        label: 'Phone',
        kind: 'text',
        pattern: '^[0-9 +/-]{6,}$',
        patternMessage: 'Digits, spaces, +, / and - only',
      },
      { key: 'message', label: 'Message', kind: 'text', required: true, minLength: 10 },
    ],
  },
  {
    id: 'shipment',
    title: 'Shipment Booking',
    fields: [
      { key: 'reference', label: 'Reference', kind: 'text', required: true, minLength: 6, maxLength: 12 },
      { key: 'weightKg', label: 'Weight (kg)', kind: 'number', required: true },
      { key: 'pickupDate', label: 'Pickup date', kind: 'date', required: true },
      {
        key: 'postalCode',
        label: 'Postal code',
        kind: 'text',
        required: true,
        pattern: '^[0-9]{4,5}$',
        patternMessage: 'Four or five digits',
      },
    ],
  },
];
