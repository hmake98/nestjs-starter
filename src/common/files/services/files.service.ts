import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FilePutPresignResponseDto } from '../dtos/file.response.dto';
import { GetPresignDto } from '../dtos/get.presign.dto';
import { IFilesServiceInterface } from '../interfaces/files.service.interface';

@Injectable()
export class FilesService implements IFilesServiceInterface {
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
    this.expiresIn = this.configService.get('aws.s3.linkExpire', 3600);
    this.bucket = this.configService.get('aws.s3.bucket');
  }

  async getPresignUrlPutObject(
    { fileName, storeType, contentType }: GetPresignDto,
    userId: string,
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
