import { Injectable, NotFoundException } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { PrismaService } from '../../../common/helper/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IFilesServiceInterface } from '../interfaces/files.service.interface';
import { GetPresignDto } from '../dtos/get.presign.dto';
import {
  IFilePresignGetResponse,
  IFilesPresignPutResponse,
} from '../interfaces/files.interface';

@Injectable()
export class FilesService implements IFilesServiceInterface {
  private readonly s3: S3Client;
  private readonly expiresIn: string;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: this.configService.get('aws.region'),
      credentials: {
        accessKeyId: this.configService.get('aws.accessKey'),
        secretAccessKey: this.configService.get('aws.secretKey'),
      },
    });
    this.expiresIn = this.configService.get('aws.s3.linkExpire');
  }

  async getPresignGetObject(
    fileId: string,
    userId: string,
  ): Promise<IFilePresignGetResponse> {
    try {
      const file = await this.prismaService.files.findUnique({
        where: {
          id: fileId,
          users: {
            every: {
              id: userId,
            },
          },
        },
      });
      if (!file) {
        throw new NotFoundException('fileNotFound');
      }
      const command = new GetObjectCommand({
        Bucket: this.configService.get('aws.s3.bucket'),
        Key: file.link,
      });
      const url = await getSignedUrl(this.s3, command, {
        expiresIn: this.configService.get('aws.linkExpire'),
      });
      return {
        file,
        url,
      };
    } catch (e) {
      throw e;
    }
  }

  async getPresginPutObject(
    file: GetPresignDto,
    userId: string,
  ): Promise<IFilesPresignPutResponse> {
    try {
      const key = `${userId}/${file.storeType}/${Date.now()}_${file.name}`;
      const command = new PutObjectCommand({
        Bucket: this.configService.get('aws.bucket'),
        Key: key,
      });
      const url = await getSignedUrl(this.s3, command, {
        expiresIn: this.configService.get('aws.linkExpire'),
      });
      return { url, expiresIn: this.expiresIn };
    } catch (e) {
      throw e;
    }
  }
}
