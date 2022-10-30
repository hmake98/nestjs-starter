import { IPreSignedUrlBody, IPreSignedUrlParams } from "./../interfaces";
import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { ConfigService } from "../../config/config.service";
import { PrismaService } from "./prisma.service";

/*
 * created enum for presigned url types.
 * How to use it ?
 * use one of the enum property as first argument in the getPresignedUrl method.
 */
export enum OperationType {
  putObject = "putObject",
  getObject = "getObject",
}

@Injectable()
export class FileService {
  private readonly bucketName: string;
  private readonly storageService: S3;
  private readonly linkExp: number;

  constructor(private readonly configService: ConfigService, private prisma: PrismaService) {
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
      const photo = await this.prisma.photos.create({
        data: {
          key,
          name,
          type,
        },
      });
      const params: IPreSignedUrlParams = {
        Bucket: this.bucketName,
        Key: `${type}/${key}`,
        Expires: this.linkExp,
      };
      const url = await this.storageService.getSignedUrlPromise(operationType, params);
      return { url, ...photo };
    } catch (e) {
      return e;
    }
  }
}
