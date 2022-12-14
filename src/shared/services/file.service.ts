import { IPreSignedUrlBody, IPreSignedUrlParams } from "./../interfaces";
import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { ConfigService } from "./config.service";

export enum OperationType {
  putObject = "putObject",
  getObject = "getObject",
}

@Injectable()
export class FileService {
  private readonly bucketName: string;
  private readonly storageService: S3;
  private readonly linkExp: number;

  constructor(private readonly configService: ConfigService) {
    const awsConfig = this.configService.get("aws");
    this.storageService = new S3({
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
      region: awsConfig.region,
      signatureVersion: "v4",
    });
    this.bucketName = awsConfig.awsBucket;
    this.linkExp = awsConfig.linkExpires;
  }

  /**
   * method to get presigned url for post image on s3
   */
  public async getPresign(operationType: OperationType, data: IPreSignedUrlBody): Promise<string | unknown> {
    try {
      const { name, type } = data;
      const key = `${Date.now()}_${name}`;
      const params: IPreSignedUrlParams = {
        Bucket: this.bucketName,
        Key: `${type}/${key}`,
        Expires: this.linkExp,
      };
      const url = await this.storageService.getSignedUrlPromise(operationType, params);
      return { url };
    } catch (e) {
      return e;
    }
  }
}
