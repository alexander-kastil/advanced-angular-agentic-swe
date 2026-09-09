export interface Secret {
  secretId: string;
  listId: string;
  name: string;
  url: string | null;
  user: string | null;
  password: string | null;
  comment: string | null;
  mfa: boolean;
  categoryIds: string[];
  version: number;
  lastChanged: string;
  fileName: string | null;
  contentType: string | null;
  fileSize: number | null;
}
