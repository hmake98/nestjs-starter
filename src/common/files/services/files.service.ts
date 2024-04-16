import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IFilesServiceInterface } from '../interfaces/files.service.interface';
import { GetPresignDto } from '../dtos/get.presign.dto';
import { IFilesPresignPutResponse } from '../interfaces/files.interface';

@Injectable()
export class FilesService implements IFilesServiceInterface {
  private readonly s3Client: S3Client;
  private readonly expiresIn: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('aws.region'),
      credentials: {
        accessKeyId: this.configService.get('aws.accessKey'),
        secretAccessKey: this.configService.get('aws.secretKey'),
      },
    });
    this.expiresIn = this.configService.get('aws.s3.linkExpire');
  }

  async getPresginPutObject(
    file: GetPresignDto,
    userId: string,
  ): Promise<IFilesPresignPutResponse> {
    try {
      const Key = `${userId}/${file.storeType}/${Date.now()}_${file.name}`;
      const command = new PutObjectCommand({
        Bucket: this.configService.get('aws.s3.bucket'),
        Key,
      });
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: this.configService.get('aws.s3.linkExpire'),
      });
      return { url, expiresIn: this.expiresIn };
    } catch (e) {
      throw e;
    }
  }
}
