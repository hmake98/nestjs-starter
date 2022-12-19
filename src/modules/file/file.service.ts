import { IPreSignedUrlBody, IPreSignedUrlParams } from '../../shared/types';
import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { awsConfig } from '../../utils/common';

export enum OperationType {
  putObject = 'putObject',
  getObject = 'getObject',
}

@Injectable()
export class FileService {
  private readonly bucketName: string;
  private readonly storageService: S3;
  private readonly linkExp: number;

  constructor() {
    this.storageService = new S3({
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
      region: awsConfig.region,
      signatureVersion: 'v4',
    });
    this.bucketName = awsConfig.awsBucket;
    this.linkExp = Number(awsConfig.linkExpires);
  }

  /**
   * method to get presigned url for post image on s3
   */
  public async getPresign(
    operationType: OperationType,
    data: IPreSignedUrlBody,
  ): Promise<string | unknown> {
    try {
      const { name, type } = data;
      const key = `${Date.now()}_${name}`;
      const params: IPreSignedUrlParams = {
        Bucket: this.bucketName,
        Key: `${type}/${key}`,
        Expires: this.linkExp,
      };
      const url = await this.storageService.getSignedUrlPromise(
        operationType,
        params,
      );
      return { url };
    } catch (e) {
      return e;
    }
  }
}
