import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { IEncryptionService } from '../interfaces/encryption.service.interface';
import { IEncryptDataPayload } from '../interfaces/encryption.interface';

@Injectable()
export class EncryptionService implements IEncryptionService {
  private iv: Buffer;
  private key: Buffer;

  constructor() {
    this.iv = randomBytes(16);
    this.key = randomBytes(32);
  }

  createHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  match(hash: string, password: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  encrypt(text: string): IEncryptDataPayload {
    const cipher = createCipheriv('aes-256-ctr', this.key, this.iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
      iv: this.iv.toString('hex'),
      data: encrypted.toString('hex'),
    };
  }

  decrypt({ data, iv }: IEncryptDataPayload): string {
    const _iv = Buffer.from(iv, 'hex');
    const encryptedText = Buffer.from(data, 'hex');
    const decipher = createDecipheriv('aes-256-ctr', this.key, _iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    return decrypted.toString();
  }
}
