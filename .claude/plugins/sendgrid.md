# SendGrid Plugin

Transactional and marketing email via SendGrid. Use as a simpler alternative to AWS SES when you don't need full AWS infrastructure.

## Packages

```bash
npm install @sendgrid/mail
```

## Environment Variables

```
# SendGrid
SENDGRID_API_KEY=SG.xxxxxx
SENDGRID_FROM_EMAIL=no-reply@yourdomain.com
SENDGRID_FROM_NAME=NestJS Starter
```

## Module Structure

### `src/app/config/mail.config.ts`

```typescript
registerAs('mail', () => ({
  apiKey: process.env.SENDGRID_API_KEY || '',
  fromEmail: process.env.SENDGRID_FROM_EMAIL || '',
  fromName: process.env.SENDGRID_FROM_NAME || 'NestJS Starter',
}))
```

### `src/common/mail/mail.module.ts`

Standard NestJS module. Register `ConfigModule.forFeature(mailConfig)`.
Provide and export: `MailService`.

### `src/common/mail/services/mail.service.ts`

Key implementation details:
- Import `* as sgMail from '@sendgrid/mail'` and `MailDataRequired` from `@sendgrid/mail`
- In `onModuleInit`: call `sgMail.setApiKey(apiKey)` and log connection confirmation
- Expose:
  - `sendEmail(options: ISendEmailOptions): Promise<void>` — calls `sgMail.send()`, wraps errors into `InternalServerErrorException`
  - `sendTemplate(to: string, subject: string, html: string, text?: string): Promise<void>` — convenience wrapper with `from` auto-populated from config
  - `sendDynamicTemplate(to: string, templateId: string, dynamicData: Record<string, unknown>): Promise<void>` — uses SendGrid dynamic templates

### `src/common/mail/interfaces/mail.interface.ts`

```typescript
export interface ISendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, unknown>;
}
```

## CommonModule Wiring

Import `MailModule` in `src/common/common.module.ts` and add to `exports`.

## Usage Example

```typescript
constructor(private readonly mail: MailService) {}

async sendPasswordReset(email: string, resetLink: string): Promise<void> {
  await this.mail.sendTemplate(
    email,
    'Reset your password',
    `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    `Reset link: ${resetLink}`,
  );
}

// Using a SendGrid dynamic template:
async sendWelcome(email: string, name: string): Promise<void> {
  await this.mail.sendDynamicTemplate(email, 'd-abc123templateid', { name });
}
```

## Notes

- Verify your sender domain in the SendGrid dashboard before going to production
- Free tier allows 100 emails/day; upgrade for volume
- SendGrid dynamic templates (created in the dashboard) are the recommended approach for HTML emails — no need to maintain HTML strings in code
- For testing, set `SENDGRID_API_KEY` to a test key; alternatively use [Mailtrap](https://mailtrap.io) and swap to an SMTP provider
