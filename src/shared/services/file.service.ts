import { IPreSignedUrlBody, IPreSignedUrlParams } from './../interfaces';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '../../config/config.service';

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
  private readonly linkExp: number;
  private readonly logger = new Logger(FileService.name);

  constructor(private readonly configService: ConfigService) {
    const awsConfig = this.configService.get('aws');
    this.bucketName = this.configService.get('awsBucket');
    this.storageService = new S3({
      ...awsConfig,
      signatureVersion: 'v4',
    });
    this.linkExp = this.configService.get('linkExpires');
  }

  /**
   * method to get presigned url for post image on s3
   */
  public async generatePresignedUrl(operationType: OperationType, data: IPreSignedUrlBody): Promise<string> {
    try {
      const params: IPreSignedUrlParams = {
        Bucket: this.bucketName,
        Key: data.key,
        Expires: this.linkExp,
      };
      data.mime ? (params.ContentType = data.mime) : null;
      return this.storageService.getSignedUrlPromise(operationType, params);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }
}
