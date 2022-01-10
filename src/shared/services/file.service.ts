import { IPreSignedUrlBody, IPreSignedUrlParams } from './../interfaces/index';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { ConfigService } from 'src/config/config.service';

/*
 * created enum for presigned url types.
 * How to use it ?
 * use one of the enum property as first argument in the getPresignedUrl method.
 */
export enum OperationType {
  putObject = 'putObject',
  getObject = 'getObject',
}

@Injectable()
export class FileService {
  private readonly bucketName: string;
  private readonly storageService: S3;
  private readonly Expires: number;
  private readonly logger = new Logger(FileService.name);

  constructor(private readonly configService: ConfigService) {
    const awsConfig = this.configService.get('aws');
    this.bucketName = this.configService.get('awsBucket');
    this.storageService = new S3({
      ...awsConfig,
      signatureVersion: 'v4',
    });
    this.Expires = this.configService.get('expires');
  }

  /*
   method to upload image to s3 bucket using multer middleware
   */
  public async uploadToS3(file: Express.Multer.File): Promise<string> {
    try {
      const uploadParams: PutObjectRequest = {
        Bucket: this.bucketName,
        Key: file.originalname,
        Body: file.buffer,
        // ACL: 'public-read',
        ContentType: file.mimetype,
      };
      const url = await this.storageService.upload(uploadParams).promise();
      return url.Location;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  /*
    method to get presigned url for image upload and download
  */
  public async generatePresignedUrl(operationType: OperationType, data: IPreSignedUrlBody): Promise<string> {
    try {
      const params: IPreSignedUrlParams = {
        Bucket: this.bucketName,
        Key: data.key,
        Expires: this.Expires,
      };
      data.mime ? (params.ContentType = data.mime) : null;
      return await this.storageService.getSignedUrlPromise(operationType, params);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }
}
