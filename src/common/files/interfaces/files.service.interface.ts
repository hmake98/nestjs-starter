import { GetPresignDto } from '../dtos/get.presign.dto';
import { FilesResponseInterface } from './files.interface';

export interface IFilesServiceInterface {
  getPresignGetObject(
    fileId: string,
    userId: string,
  ): Promise<FilesResponseInterface>;
  getPresginPutObject(
    file: GetPresignDto,
    userId: string,
  ): Promise<FilesResponseInterface>;
}
