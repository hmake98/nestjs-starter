export interface Auth {
  id: number;
  email: string;
  type: string;
  role: string;
  iat: number;
  exp: number;
}
