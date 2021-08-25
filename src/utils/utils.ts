import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { readFile } from 'fs';

const saltOrRounds = 10;

export const createHash = (password: string): string => {
  const hash = bcrypt.hashSync(password, saltOrRounds);
  return hash;
};

export const match = (hash: string, password: string): boolean => {
  const isMatch = bcrypt.compareSync(password, hash);
  return isMatch;
};

export const handleError = (e) => {
  throw new Error(e);
};

export async function readFilePromise(filePath): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (err, html) => {
      if (!err) {
        resolve(html);
      } else {
        reject(err);
      }
    });
  });
}

export function replaceAll(str, map) {
  for (const key in map) {
    str = str.replaceAll(key, map[key]);
  }
  return str;
}
