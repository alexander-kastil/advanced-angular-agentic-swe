export enum SecretListType {
  Secrets = 1,
  Vault = 2,
}

export interface SecretList {
  listId: string;
  name: string;
  description: string | null;
  type: SecretListType;
  secretCount: number;
}
