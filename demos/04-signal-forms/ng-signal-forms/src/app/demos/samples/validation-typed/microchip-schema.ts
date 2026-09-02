import type { StandardSchemaV1 } from '@standard-schema/spec';

export interface MicrochipModel {
  chipId: string;
  species: string;
}

const SPECIES = ['dog', 'cat', 'ferret'];

export const microchipSchema: StandardSchemaV1<MicrochipModel> = {
  '~standard': {
    version: 1,
    vendor: 'ng-signal-forms-demo',
    validate: (value) => {
      const model = value as MicrochipModel;
      const issues: StandardSchemaV1.Issue[] = [];

      if (!/^[0-9]{15}$/.test(model.chipId)) {
        issues.push({ message: 'A microchip id is exactly 15 digits', path: ['chipId'] });
      }
      if (!SPECIES.includes(model.species.toLowerCase())) {
        issues.push({ message: `Registerable species: ${SPECIES.join(', ')}`, path: ['species'] });
      }

      return issues.length ? { issues } : { value: model };
    },
  },
};
