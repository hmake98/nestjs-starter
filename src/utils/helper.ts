import * as bcrypt from 'bcrypt';
import { readFile } from 'fs';
import { saltOrRounds } from 'src/shared/common/constant';

export const helpers = {
  createHash: (password: string): string => {
    const hash = bcrypt.hashSync(password, saltOrRounds);
    return hash;
  },
  match: (hash: string, password: string): boolean => {
    const isMatch = bcrypt.compareSync(password, hash);
    return isMatch;
  },
  readFilePromise: async (filePath): Promise<string> => {
    return new Promise((resolve, reject) => {
      readFile(filePath, 'utf8', (err, html) => {
        if (!err) {
          resolve(html);
        } else {
          reject(err);
        }
      });
    });
  },
};
