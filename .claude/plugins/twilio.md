# Twilio Plugin

SMS, voice calls, and WhatsApp messaging via Twilio. Use for OTP verification, transactional SMS alerts, and two-factor authentication.

## Packages

```bash
npm install twilio
npm install -D @types/twilio
```

## Environment Variables

```
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+15551234567
```

## Module Structure

### `src/app/config/sms.config.ts`

```typescript
registerAs('sms', () => ({
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
}))
```

### `src/common/sms/sms.module.ts`

Standard NestJS module. Register `ConfigModule.forFeature(smsConfig)`.
Provide and export: `SmsService`.

### `src/common/sms/services/sms.service.ts`

Key implementation details:
- Import `Twilio` from `twilio`
- In `onModuleInit`: instantiate `new Twilio(accountSid, authToken)` and store as `private client`
- Expose:
  - `sendSms(to: string, body: string): Promise<string>` — sends SMS, returns message SID
  - `sendOtp(to: string, code: string): Promise<string>` — formats and sends a standard OTP message
  - `sendWhatsApp(to: string, body: string): Promise<string>` — prefix `to` with `whatsapp:` automatically

### `src/common/sms/interfaces/sms.interface.ts`

```typescript
export interface ISendSmsOptions {
  to: string;
  body: string;
}
```

## CommonModule Wiring

Import `SmsModule` in `src/common/common.module.ts` and add to `exports`.

## Usage Example

```typescript
constructor(private readonly sms: SmsService) {}

async sendVerificationCode(phone: string, code: string): Promise<void> {
  await this.sms.sendOtp(phone, code);
}

async notifyUser(phone: string, message: string): Promise<void> {
  await this.sms.sendSms(phone, message);
}
```

## Notes

- Phone numbers must be in E.164 format: `+15551234567`
- Twilio trial accounts can only send to verified numbers — upgrade to a paid account for production
- For OTP use-cases, consider Twilio Verify instead of raw SMS: `client.verify.v2.services(serviceSid).verifications.create()`
- WhatsApp requires a separate Twilio WhatsApp-enabled number and sender registration
- Never log auth tokens; the Pino config already redacts `authToken` field names
