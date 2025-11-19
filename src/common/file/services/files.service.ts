import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';

import { FilePresignDto } from '../dtos/request/file.presign.dto';
import { FilePutPresignResponseDto } from '../dtos/response/file.response.dto';
import { IFilesServiceInterface } from '../interfaces/files.service.interface';

@Injectable()
export class FileService implements IFilesServiceInterface {
    constructor(
        private readonly awsS3Service: AwsS3Service,
        private readonly logger: PinoLogger
    ) {
        this.logger.setContext(FileService.name);
    }

    async getPresignUrlPutObject(
        userId: string,
        { fileName, storeType, contentType }: FilePresignDto
    ): Promise<FilePutPresignResponseDto> {
        try {
            const key = `${userId}/${storeType}/${Date.now()}_${fileName}`;

            const { url, expiresIn } =
                await this.awsS3Service.getPresignedUploadUrl(key, contentType);

            this.logger.info(
                { userId, fileName, storeType },
                'Generated presigned URL for file upload'
            );

            return { url, expiresIn };
        } catch (error) {
            this.logger.error(
                `Failed to generate presigned URL: ${error.message}`
            );
            throw error;
        }
    }
}
