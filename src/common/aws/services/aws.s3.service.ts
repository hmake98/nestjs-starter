import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

import { IAwsS3Service } from '../interfaces/aws.s3.service.interface';

@Injectable()
export class AwsS3Service implements IAwsS3Service {
    private readonly s3Client: S3Client;
    private readonly bucket: string;
    private readonly linkExpire: number;

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: PinoLogger
    ) {
        this.logger.setContext(AwsS3Service.name);

        const region = this.configService.get<string>('aws.s3.region');
        const accessKeyId = this.configService.get<string>('aws.accessKey');
        const secretAccessKey = this.configService.get<string>('aws.secretKey');

        this.s3Client = new S3Client({
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            region,
        });

        this.bucket = this.configService.get<string>('aws.s3.bucket');
        this.linkExpire = this.configService.get<number>(
            'aws.s3.linkExpire',
            3600
        );

        this.logger.info(
            { region, bucket: this.bucket },
            'S3 service initialized'
        );
    }

    async getPresignedUploadUrl(
        key: string,
        contentType: string,
        expiresIn?: number
    ): Promise<{ url: string; expiresIn: number }> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                ContentType: contentType,
            });

            const expires = expiresIn || this.linkExpire;
            const url = await getSignedUrl(this.s3Client, command, {
                expiresIn: expires,
            });

            this.logger.debug(
                { key, contentType, expiresIn: expires },
                'Generated presigned upload URL'
            );

            return { url, expiresIn: expires };
        } catch (error) {
            this.logger.error(
                `Failed to generate presigned URL: ${error.message}`
            );
            throw error;
        }
    }

    async uploadObject(
        key: string,
        body: Buffer | string,
        contentType: string
    ): Promise<void> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: body,
                ContentType: contentType,
            });

            await this.s3Client.send(command);

            this.logger.info({ key, contentType }, 'Object uploaded to S3');
        } catch (error) {
            this.logger.error(
                `Failed to upload object to S3: ${error.message}`
            );
            throw error;
        }
    }

    getPublicUrl(key: string): string {
        const region = this.configService.get<string>('aws.s3.region');
        return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
    }
}
