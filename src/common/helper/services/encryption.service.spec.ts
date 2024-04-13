import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let encryptionService: EncryptionService;

  beforeEach(() => {
    encryptionService = new EncryptionService();
  });

  it('should be defined', () => {
    expect(encryptionService).toBeDefined();
  });

  describe('createHash', () => {
    it('should create a hash of the password', () => {
      const password = 'password123';
      const hash = encryptionService.createHash(password);
      expect(hash).toBeDefined();
      expect(hash).not.toEqual(password);
    });
  });

  describe('match', () => {
    it('should return true if the password matches the hash', () => {
      const password = 'password123';
      const hash = encryptionService.createHash(password);
      const result = encryptionService.match(hash, password);
      expect(result).toBeTruthy();
    });

    it('should return false if the password does not match the hash', () => {
      const password = 'password123';
      const hash = encryptionService.createHash(password);
      const result = encryptionService.match(hash, 'wrongpassword');
      expect(result).toBeFalsy();
    });
  });

  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt text successfully', () => {
      const plaintext = 'Hello, world!';
      const encryptedData = encryptionService.encrypt(plaintext);
      expect(encryptedData).toBeDefined();

      const decryptedText = encryptionService.decrypt(encryptedData);
      expect(decryptedText).toEqual(plaintext);
    });
  });
});
