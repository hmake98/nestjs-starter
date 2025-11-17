import { registerAs } from '@nestjs/config';

/**
 * AWS Configuration
 *
 * This configuration supports region-specific settings for different AWS services.
 * Each service (S3, SES) can have its own region configuration.
 *
 * Environment variables:
 * - AWS_ACCESS_KEY: AWS access key ID (shared across all services)
 * - AWS_SECRET_KEY: AWS secret access key (shared across all services)
 * - AWS_S3_REGION: AWS region for S3 service (e.g., us-east-1, eu-west-1)
 * - AWS_S3_BUCKET: S3 bucket name
 * - AWS_S3_PRESIGN_LINK_EXPIRES: Presigned URL expiration time in seconds (default: 3600)
 * - AWS_SES_REGION: AWS region for SES service (e.g., us-east-1, eu-west-1)
 * - AWS_SES_SOURCE_EMAIL: Default source email for SES
 */
export default registerAs(
    'aws',
    (): Record<string, any> => ({
        // Shared AWS credentials
        accessKey: process.env.AWS_ACCESS_KEY,
        secretKey: process.env.AWS_SECRET_KEY,

        // S3 Configuration
        s3: {
            region: process.env.AWS_S3_REGION || 'us-east-1',
            bucket: process.env.AWS_S3_BUCKET,
            linkExpire: Number(process.env.AWS_S3_PRESIGN_LINK_EXPIRES) || 3600,
        },

        // SES Configuration
        ses: {
            region: process.env.AWS_SES_REGION || 'us-east-1',
            sourceEmail: process.env.AWS_SES_SOURCE_EMAIL,
        },
    })
);
