import { FilePresignDto } from '../dtos/request/file.presign.dto';
import { FilePutPresignResponseDto } from '../dtos/response/file.response.dto';

export interface IFilesServiceInterface {
    getPresignUrlPutObject(
        userId: string,
        data: FilePresignDto
    ): Promise<FilePutPresignResponseDto>;
}
