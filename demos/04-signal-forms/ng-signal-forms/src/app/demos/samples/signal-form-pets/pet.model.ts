export type PetType = 'cat' | 'dog';
export type Owner = 'Alex' | 'Andreas';

export interface Pet {
    id?: number;
    name: string;
    age: number;
    type: PetType;
    breed: string;
    owner: Owner;
}
