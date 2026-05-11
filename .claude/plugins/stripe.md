# Stripe Plugin

Payment processing for subscriptions, one-time charges, and marketplace payouts. Includes webhook signature verification.

## Packages

```bash
npm install stripe
```

## Environment Variables

```
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_API_VERSION=2024-12-18.acacia
```

## Module Structure

### `src/app/config/stripe.config.ts`

```typescript
registerAs('stripe', () => ({
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  apiVersion: process.env.STRIPE_API_VERSION || '2024-12-18.acacia',
}))
```

### `src/common/stripe/stripe.module.ts`

Standard NestJS module. Register `ConfigModule.forFeature(stripeConfig)`.
Provide and export: `StripeService`.

### `src/common/stripe/services/stripe.service.ts`

Key implementation details:
- Import `Stripe` from `stripe`
- In `onModuleInit`: instantiate `new Stripe(secretKey, { apiVersion })` and store as `private stripe`
- Expose:
  - `createPaymentIntent(amount: number, currency: string, metadata?: Record<string, string>): Promise<Stripe.PaymentIntent>`
  - `createCustomer(email: string, name: string): Promise<Stripe.Customer>`
  - `createSubscription(customerId: string, priceId: string): Promise<Stripe.Subscription>`
  - `cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription>`
  - `constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event` — uses `this.stripe.webhooks.constructEvent()` with `webhookSecret`; throws `BadRequestException` on invalid signature

### `src/common/stripe/interfaces/stripe.interface.ts`

```typescript
export interface ICreatePaymentOptions {
  amount: number;
  currency: string;
  customerId?: string;
  metadata?: Record<string, string>;
}
```

## CommonModule Wiring

Import `StripeModule` in `src/common/common.module.ts` and add to `exports`.

## Webhook Controller Note

After the plugin is installed, add a webhook endpoint to an appropriate controller. The raw body must be preserved for signature verification — add this route before the global `json()` middleware or use `express.raw()`:

```typescript
@Post('/webhook/stripe')
@PublicRoute()
async stripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') sig: string) {
  const event = this.stripeService.constructWebhookEvent(req.rawBody, sig);
  // handle event.type
}
```

Enable raw body parsing in `main.ts`: `app.use('/webhook/stripe', express.raw({ type: 'application/json' }))`.

## Usage Example

```typescript
constructor(private readonly stripe: StripeService) {}

async chargeUser(email: string, amountCents: number): Promise<string> {
  const customer = await this.stripe.createCustomer(email, email);
  const intent = await this.stripe.createPaymentIntent(amountCents, 'usd', {
    customerId: customer.id,
  });
  return intent.client_secret;
}
```

## Notes

- Use test keys (`sk_test_...`) during development; Stripe CLI can forward webhooks locally: `stripe listen --forward-to localhost:3000/webhook/stripe`
- Store `customerId` on the `User` model (add a Prisma migration) to avoid creating duplicate customers
- Never log the full payment intent or card details — Stripe objects contain sensitive fingerprints
