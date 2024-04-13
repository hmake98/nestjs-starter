export interface IEncryptionService {
  createHash(password: string): string;
  match(hash: string, password: string): boolean;
  encrypt(text: string): { iv: string; data: string };
  decrypt(data: { iv: string; data: string }): string;
}
