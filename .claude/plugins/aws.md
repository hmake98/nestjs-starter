# AWS Plugin

Full AWS integration: S3 object storage, SES transactional email, and Secrets Manager (Key Vault equivalent). Uses the AWS credential provider chain — IAM roles in production, no static keys required.

## Packages

```bash
# Core credential chain (always install):
npm install @aws-sdk/credential-providers

# Secrets Manager (always recommended):
npm install @aws-sdk/client-secrets-manager

# Object storage:
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

# Transactional email:
npm install @aws-sdk/client-ses
```

Install only the SDK clients for the sub-services you need. All share the same credential chain.

## Credential Strategy

**Production (ECS, Lambda, EC2, EKS):** Attach an IAM role to the compute resource. The SDK picks it up automatically via `fromNodeProviderChain()` — no keys, no secrets in env vars.

**Local development:** Set `AWS_PROFILE` to use a named profile from `~/.aws/credentials`, or set `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` temporarily. Never commit these to `.env`.

The `fromNodeProviderChain()` credential provider resolves in this order:
1. Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
2. SSO session (`AWS_PROFILE`)
3. EC2/ECS/Lambda instance metadata (IAM role) — used in production
4. EKS Pod Identity / IRSA

## Environment Variables

```
# AWS Region (required everywhere)
AWS_REGION=us-east-1

# Local dev only — remove in production (use IAM role instead)
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_PROFILE=default

# S3 (if using object storage)
AWS_S3_BUCKET=nestjs-starter-uploads

# SES (if using email)
AWS_SES_FROM_EMAIL=no-reply@yourdomain.com
AWS_SES_FROM_NAME=NestJS Starter

# Secrets Manager
AWS_SECRETS_MANAGER_PREFIX=nestjs-starter/production
```

## Module Structure

### `src/app/config/aws.config.ts`

```typescript
registerAs('aws', () => ({
  region: process.env.AWS_REGION || 'us-east-1',
  s3: {
    bucket: process.env.AWS_S3_BUCKET || '',
  },
  ses: {
    fromEmail: process.env.AWS_SES_FROM_EMAIL || '',
    fromName: process.env.AWS_SES_FROM_NAME || 'NestJS Starter',
  },
  secretsManager: {
    prefix: process.env.AWS_SECRETS_MANAGER_PREFIX || 'nestjs-starter',
  },
}))
```

No access key or secret in the config factory — the SDK resolves credentials automatically.

### `src/common/aws/aws.module.ts`

Standard NestJS module. Register `ConfigModule.forFeature(awsConfig)`.
Provide and export only the sub-services you are using.

```typescript
@Module({
  imports: [ConfigModule.forFeature(awsConfig)],
  providers: [AwsS3Service, AwsSesService, AwsSecretsService],
  exports: [AwsS3Service, AwsSesService, AwsSecretsService],
})
export class AwsModule {}
```

---

### Sub-service: Secrets Manager — `src/common/aws/services/aws-secrets.service.ts`

Key implementation details:
- Import `SecretsManagerClient`, `GetSecretValueCommand`, `CreateSecretCommand`, `UpdateSecretCommand`, `DeleteSecretCommand` from `@aws-sdk/client-secrets-manager`
- Import `fromNodeProviderChain` from `@aws-sdk/credential-providers`
- In `onModuleInit`: instantiate `new SecretsManagerClient({ region, credentials: fromNodeProviderChain() })` and log ready
- All secret names are namespaced internally as `<prefix>/<name>` (e.g., `nestjs-starter/production/stripe-key`)
- Expose:
  - `getSecret(name: string): Promise<string>` — fetches secret string value; throws `InternalServerErrorException` on failure
  - `getSecretJson<T>(name: string): Promise<T>` — fetches and JSON-parses the secret value
  - `setSecret(name: string, value: string): Promise<void>` — creates or updates via `UpdateSecretCommand`; falls back to `CreateSecretCommand` on ResourceNotFoundException
  - `deleteSecret(name: string, forceDelete = false): Promise<void>` — `forceDelete: true` skips the 7-day recovery window

---

### Sub-service: S3 — `src/common/aws/services/aws-s3.service.ts`

Key implementation details:
- Import `S3Client`, `PutObjectCommand`, `GetObjectCommand`, `DeleteObjectCommand` from `@aws-sdk/client-s3`
- Import `getSignedUrl` from `@aws-sdk/s3-request-presigner`
- Import `fromNodeProviderChain` from `@aws-sdk/credential-providers`
- In `onModuleInit`: instantiate `new S3Client({ region, credentials: fromNodeProviderChain() })`; log ready
- Expose:
  - `upload(key: string, body: Buffer, contentType: string): Promise<string>` — uploads and returns the public object URL
  - `getPresignedUploadUrl(key: string, contentType: string, expiresIn = 3600): Promise<string>`
  - `getPresignedDownloadUrl(key: string, expiresIn = 3600): Promise<string>`
  - `delete(key: string): Promise<void>`
  - `buildObjectUrl(key: string): string` — `https://<bucket>.s3.<region>.amazonaws.com/<key>`

---

### Sub-service: SES — `src/common/aws/services/aws-ses.service.ts`

Key implementation details:
- Import `SESClient`, `SendEmailCommand` from `@aws-sdk/client-ses`
- Import `fromNodeProviderChain` from `@aws-sdk/credential-providers`
- In `onModuleInit`: instantiate `new SESClient({ region, credentials: fromNodeProviderChain() })`; log ready
- Expose:
  - `sendEmail(options: IAwsSendEmailOptions): Promise<void>`
  - `sendTemplate(to: string, subject: string, html: string, text?: string): Promise<void>` — auto-populates `from` from config

---

### `src/common/aws/interfaces/aws.interface.ts`

```typescript
export interface IAwsSendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export interface IAwsUploadOptions {
  key: string;
  body: Buffer;
  contentType: string;
}
```

## CommonModule Wiring

Import `AwsModule` in `src/common/common.module.ts` and add to `exports`.

## Usage Examples

```typescript
// Secrets Manager — load secrets at startup instead of using env vars
constructor(private readonly secrets: AwsSecretsService) {}

async getStripeKey(): Promise<string> {
  return this.secrets.getSecret('stripe/secret-key');
  // resolves to: nestjs-starter/production/stripe/secret-key
}

async getDbCredentials(): Promise<{ url: string }> {
  return this.secrets.getSecretJson<{ url: string }>('database/credentials');
}
```

```typescript
// S3 — file upload + presigned URLs
constructor(private readonly s3: AwsS3Service) {}

async uploadAvatar(userId: string, buffer: Buffer): Promise<string> {
  return this.s3.upload(`avatars/${userId}.webp`, buffer, 'image/webp');
}

async getClientUploadUrl(filename: string): Promise<string> {
  return this.s3.getPresignedUploadUrl(`uploads/${filename}`, 'application/octet-stream');
}
```

## IAM Role Permissions (least-privilege)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::<bucket>/*"
    },
    {
      "Effect": "Allow",
      "Action": ["ses:SendEmail"],
      "Resource": "arn:aws:ses:<region>:<account>:identity/<from-email>"
    },
    {
      "Effect": "Allow",
      "Action": ["secretsmanager:GetSecretValue", "secretsmanager:PutSecretValue", "secretsmanager:CreateSecret", "secretsmanager:DeleteSecret"],
      "Resource": "arn:aws:secretsmanager:<region>:<account>:secret:<prefix>/*"
    }
  ]
}
```

Attach this policy to the IAM role assigned to your compute resource (ECS task role, Lambda execution role, EC2 instance profile).

## Notes

- **Never put `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` in production env vars.** Use IAM roles exclusively.
- For local dev, prefer `AWS_PROFILE` with `~/.aws/credentials` over raw keys in `.env`
- For CI/CD (GitHub Actions), use OIDC federation with `aws-actions/configure-aws-credentials` — no stored secrets
- For local AWS emulation, use [LocalStack](https://localstack.cloud): add `endpoint: 'http://localhost:4566'` to each SDK client constructor
- SES sandbox: verify sender domain before production; request production access from AWS console
- S3 uploads > 5 MB: use multipart upload via `@aws-sdk/lib-storage`
