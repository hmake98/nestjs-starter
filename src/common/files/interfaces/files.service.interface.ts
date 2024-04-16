import { GetPresignDto } from '../dtos/get.presign.dto';
import { IFilesPresignPutResponse } from './files.interface';

export interface IFilesServiceInterface {
  getPresginPutObject(
    file: GetPresignDto,
    userId: string,
  ): Promise<IFilesPresignPutResponse>;
}
