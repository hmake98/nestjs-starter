import { FilePutPresignResponseDto } from '../dtos/file.response.dto';
import { GetPresignDto } from '../dtos/get.presign.dto';

export interface IFilesServiceInterface {
  getPresginUrlPutObject(
    file: GetPresignDto,
    userId: string,
  ): Promise<FilePutPresignResponseDto>;
}
