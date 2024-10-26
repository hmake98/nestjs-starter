import { FilePresignDto } from '../dtos/file.presign.dto';
import { FilePutPresignResponseDto } from '../dtos/file.response.dto';

export interface IFilesServiceInterface {
    getPresignUrlPutObject(
        userId: string,
        data: FilePresignDto
    ): Promise<FilePutPresignResponseDto>;
}
