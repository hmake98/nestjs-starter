import { Files } from '@prisma/client';

export interface IFilesPresignPutResponse {
  url: string;
  expiresIn: string;
}

export interface IFilePresignGetResponse {
  file: Files;
  url: string;
}
