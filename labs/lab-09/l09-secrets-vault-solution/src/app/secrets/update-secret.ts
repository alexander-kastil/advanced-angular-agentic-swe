export interface UpdateSecret {
  name: string;
  url: string;
  user: string;
  comment: string;
  mfa: boolean;
  categoryIds: string[];
}
