# Azure Plugin

Full Azure integration: Blob Storage, Azure Communication Services (email), and Key Vault secret management. Uses `DefaultAzureCredential` — Managed Identity in production, zero secrets in env vars.

## Packages

```bash
# Core identity (always install):
npm install @azure/identity

# Key Vault (always recommended):
npm install @azure/keyvault-secrets

# Blob Storage:
npm install @azure/storage-blob

# Azure Communication Services (email):
npm install @azure/communication-email
```

Install only the SDK packages for the sub-services you need. All share the same `DefaultAzureCredential`.

## Credential Strategy

**Production (AKS, App Service, Azure Functions, VM):** Enable System-Assigned or User-Assigned Managed Identity on the compute resource. `DefaultAzureCredential` picks it up automatically — no client secret, no certificate, nothing in env vars.

**Local development:** Run `az login` once. `DefaultAzureCredential` uses your CLI session automatically. No env vars required.

**CI/CD / service principal fallback:** Set `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, and `AZURE_CLIENT_SECRET`. `DefaultAzureCredential` reads them automatically — same code, no changes.

`DefaultAzureCredential` resolves credentials in this order:
1. `AZURE_*` environment variables (service principal) — local dev / CI
2. Workload Identity (AKS with federated credentials)
3. Managed Identity — used in production
4. Azure CLI session
5. Azure PowerShell / Developer CLI

## Environment Variables

```
# Key Vault URL (required — the vault endpoint, not a secret itself)
AZURE_KEYVAULT_URL=https://your-vault.vault.azure.net

# Blob Storage
AZURE_STORAGE_ACCOUNT_URL=https://youraccount.blob.core.windows.net
AZURE_STORAGE_CONTAINER=uploads

# Azure Communication Services (email)
AZURE_COMMUNICATION_ENDPOINT=https://your-resource.communication.azure.com
AZURE_COMMUNICATION_FROM_EMAIL=no-reply@yourdomain.com

# Local dev / CI only — remove in production (Managed Identity takes over)
AZURE_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_CLIENT_SECRET=your_client_secret_for_dev_only
```

## Module Structure

### `src/app/config/azure.config.ts`

```typescript
registerAs('azure', () => ({
  keyVault: {
    url: process.env.AZURE_KEYVAULT_URL || '',
  },
  storage: {
    accountUrl: process.env.AZURE_STORAGE_ACCOUNT_URL || '',
    container: process.env.AZURE_STORAGE_CONTAINER || 'uploads',
  },
  communication: {
    endpoint: process.env.AZURE_COMMUNICATION_ENDPOINT || '',
    fromEmail: process.env.AZURE_COMMUNICATION_FROM_EMAIL || '',
  },
}))
```

No client ID, tenant ID, or client secret in the config factory — `DefaultAzureCredential` reads them from the environment automatically.

### `src/common/azure/azure.module.ts`

Standard NestJS module. Register `ConfigModule.forFeature(azureConfig)`.
Provide and export only the sub-services you are using.

```typescript
@Module({
  imports: [ConfigModule.forFeature(azureConfig)],
  providers: [AzureKeyVaultService, AzureBlobService, AzureMailService],
  exports: [AzureKeyVaultService, AzureBlobService, AzureMailService],
})
export class AzureModule {}
```

---

### Sub-service: Key Vault — `src/common/azure/services/azure-key-vault.service.ts`

Key implementation details:
- Import `SecretClient` from `@azure/keyvault-secrets`
- Import `DefaultAzureCredential` from `@azure/identity`
- In `onModuleInit`: instantiate `new SecretClient(keyVaultUrl, new DefaultAzureCredential())`; log ready
- Expose:
  - `getSecret(name: string): Promise<string>` — calls `this.client.getSecret(name)`, returns `.value`; throws `InternalServerErrorException` if not found or access denied
  - `setSecret(name: string, value: string): Promise<void>` — calls `this.client.setSecret(name, value)`
  - `deleteSecret(name: string): Promise<void>` — begins soft-delete (retained 90 days by default)
  - `listSecretNames(): Promise<string[]>` — iterates `this.client.listPropertiesOfSecrets()`, returns names

---

### Sub-service: Blob Storage — `src/common/azure/services/azure-blob.service.ts`

Key implementation details:
- Import `BlobServiceClient`, `ContainerClient`, `StorageSharedKeyCredential`, `generateBlobSASQueryParameters`, `BlobSASPermissions` from `@azure/storage-blob`
- Import `DefaultAzureCredential` from `@azure/identity`
- In `onModuleInit`: instantiate `new BlobServiceClient(accountUrl, new DefaultAzureCredential())`; get the container client via `this.blobServiceClient.getContainerClient(container)`; log ready
- Expose:
  - `upload(blobName: string, body: Buffer, contentType: string): Promise<string>` — uploads and returns blob URL
  - `getPresignedUploadUrl(blobName: string, expiresInMinutes = 60): Promise<string>` — generates a SAS URL (requires storage account key stored in Key Vault, retrieved at upload time)
  - `download(blobName: string): Promise<Buffer>`
  - `delete(blobName: string): Promise<void>`
  - `buildBlobUrl(blobName: string): string` — `<accountUrl>/<container>/<blobName>`

---

### Sub-service: Mail — `src/common/azure/services/azure-mail.service.ts`

Key implementation details:
- Import `EmailClient` from `@azure/communication-email`
- Import `DefaultAzureCredential` from `@azure/identity`
- In `onModuleInit`: instantiate `new EmailClient(endpoint, new DefaultAzureCredential())`; log ready
- Expose:
  - `sendEmail(options: IAzureSendEmailOptions): Promise<void>` — calls `this.client.beginSend()`, polls until operation completes; throws `InternalServerErrorException` on failure
  - `sendTemplate(to: string, subject: string, html: string, text?: string): Promise<void>` — convenience wrapper with `from` auto-populated from config

---

### `src/common/azure/interfaces/azure.interface.ts`

```typescript
export interface IAzureSendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export interface IAzureUploadOptions {
  blobName: string;
  body: Buffer;
  contentType: string;
}
```

## CommonModule Wiring

Import `AzureModule` in `src/common/common.module.ts` and add to `exports`.

## Usage Examples

```typescript
// Key Vault — load secrets at startup instead of using env vars
constructor(private readonly keyVault: AzureKeyVaultService) {}

async getStripeKey(): Promise<string> {
  return this.keyVault.getSecret('stripe-secret-key');
}

async getDbUrl(): Promise<string> {
  return this.keyVault.getSecret('database-url');
}

async rotateKey(name: string, newValue: string): Promise<void> {
  await this.keyVault.setSecret(name, newValue);
}
```

```typescript
// Blob Storage — file upload
constructor(private readonly blob: AzureBlobService) {}

async uploadAvatar(userId: string, buffer: Buffer): Promise<string> {
  return this.blob.upload(`avatars/${userId}.webp`, buffer, 'image/webp');
}
```

```typescript
// Mail — transactional email
constructor(private readonly mail: AzureMailService) {}

async sendPasswordReset(email: string, link: string): Promise<void> {
  await this.mail.sendTemplate(email, 'Reset your password', `<a href="${link}">Reset</a>`);
}
```

## Azure RBAC Roles Required (least-privilege)

Assign these built-in roles to the Managed Identity (or service principal) on each resource:

| Resource | Role |
|---|---|
| Key Vault | `Key Vault Secrets User` (read) or `Key Vault Secrets Officer` (read + write) |
| Storage Account | `Storage Blob Data Contributor` |
| Communication Services | `Contributor` (ACS does not have finer-grained data-plane roles yet) |

Assign via: Azure Portal → Resource → Access Control (IAM) → Add role assignment → select Managed Identity.

## Notes

- **Never store `AZURE_CLIENT_SECRET` in production.** Use Managed Identity exclusively — it is automatically rotated by Azure.
- For AKS, use [Workload Identity](https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview) (federated credentials) instead of pod-level Managed Identity — it is more secure and auditable
- For Blob SAS URL generation, the storage account key must be accessible; store it in Key Vault and fetch it at runtime via `AzureKeyVaultService` rather than hardcoding it
- Azure Key Vault soft-delete is enabled by default — deleted secrets are retained 90 days; use `purgeDeletedSecret()` for immediate permanent removal (requires `Key Vault Secrets Purge` permission)
- For local emulation, use [Azurite](https://github.com/Azure/Azurite) for Blob Storage: `docker run --rm -p 10000:10000 mcr.microsoft.com/azure-storage/azurite`
