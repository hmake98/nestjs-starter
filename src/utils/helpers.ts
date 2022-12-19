import * as bcrypt from 'bcrypt';
import { readFile } from 'fs';

export const helpers = {
  createHash: (password: string): string => {
    const hash = bcrypt.hashSync(password, 10);
    return hash;
  },
  match: (hash: string, password: string): boolean => {
    const isMatch = bcrypt.compareSync(password, hash);
    return isMatch;
  },
  readFilePromise: async (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      readFile(filePath, 'utf8', (e, html) => {
        if (!e) {
          resolve(html);
        } else {
          reject(e);
        }
      });
    });
  },
};
