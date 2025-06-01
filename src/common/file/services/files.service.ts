import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FilePresignDto } from '../dtos/request/file.presign.dto';
import { FilePutPresignResponseDto } from '../dtos/response/file.response.dto';
import { IFilesServiceInterface } from '../interfaces/files.service.interface';

@Injectable()
export class FileService implements IFilesServiceInterface {
    private readonly s3Client: S3Client;
    private readonly expiresIn: number;
    private readonly bucket: string;

    constructor(private readonly configService: ConfigService) {
        this.s3Client = new S3Client({
            credentials: {
                accessKeyId: this.configService.get('aws.accessKey'),
                secretAccessKey: this.configService.get('aws.secretKey'),
            },
            region: this.configService.get('aws.region'),
        });
        this.expiresIn = this.configService.get('aws.s3.linkExpire');
        this.bucket = this.configService.get('aws.s3.bucket');
    }

    async getPresignUrlPutObject(
        userId: string,
        { fileName, storeType, contentType }: FilePresignDto
    ): Promise<FilePutPresignResponseDto> {
        try {
            const Key = `${userId}/${storeType}/${Date.now()}_${fileName}`;
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key,
                ContentType: contentType,
            });
            const url = await getSignedUrl(this.s3Client, command, {
                expiresIn: this.expiresIn,
            });
            return { url, expiresIn: this.expiresIn };
        } catch (error) {
            throw error;
        }
    }
}
