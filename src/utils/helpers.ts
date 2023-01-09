import * as bcrypt from 'bcrypt';
import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';

const iv = randomBytes(16);
const key = randomBytes(32);

export const utils = {
  createHash: (password: string): string => {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  },
  match: (hash: string, password: string): boolean => {
    return bcrypt.compareSync(password, hash);
  },
  encrypt: async (
    text: string,
  ): Promise<{ iv: string; encryptedData: string }> => {
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted.toString('hex'),
    };
  },
  decrypt: async (data: {
    iv: string;
    encryptedData: string;
  }): Promise<string> => {
    const iv = Buffer.from(data.iv, 'hex');
    const encryptedText = Buffer.from(data.encryptedData, 'hex');
    const decipher = createDecipheriv('aes-256-ctr', Buffer.from(key), iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    return decrypted.toString();
  },
};

export const helpers = {};
