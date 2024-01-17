import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';

@Injectable()
export class HelperService {
  private iv: Buffer;
  private key: Buffer;

  constructor() {
    this.iv = randomBytes(16);
    this.key = randomBytes(32);
  }

  createHash(password: string) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  }

  match(hash: string, password: string) {
    return bcrypt.compareSync(password, hash);
  }

  async encrypt(text: string): Promise<{ iv: string; encryptedData: string }> {
    const cipher = createCipheriv('aes-256-ctr', this.key, this.iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
      iv: this.iv.toString('hex'),
      encryptedData: encrypted.toString('hex'),
    };
  }

  decrypt(data: { iv: string; encryptedData: string }): string {
    const iv = Buffer.from(data.iv, 'hex');
    const encryptedText = Buffer.from(data.encryptedData, 'hex');
    const decipher = createDecipheriv('aes-256-ctr', Buffer.from(this.key), iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    return decrypted.toString();
  }
}
