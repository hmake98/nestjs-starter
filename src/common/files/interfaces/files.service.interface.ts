import { GetPresignDto } from '../dtos/get.presign.dto';
import {
  IFilePresignGetResponse,
  IFilesPresignPutResponse,
} from './files.interface';

export interface IFilesServiceInterface {
  getPresignGetObject(
    fileId: string,
    userId: string,
  ): Promise<IFilePresignGetResponse>;
  getPresginPutObject(
    file: GetPresignDto,
    userId: string,
  ): Promise<IFilesPresignPutResponse>;
}
