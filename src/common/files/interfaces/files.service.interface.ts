import { FilePutPresignResponseDto } from '../dtos/file.response.dto';
import { GetPresignDto } from '../dtos/get.presign.dto';

export interface IFilesServiceInterface {
  getPresignUrlPutObject(data: GetPresignDto, userId: string): Promise<FilePutPresignResponseDto>;
}
