# RabbitMQ Plugin

AMQP message broker for async event-driven communication between services. Use when you need reliable pub/sub, fanout, or work-queue patterns with dead-letter support.

## Packages

```bash
npm install @golevelup/nestjs-rabbitmq amqplib
npm install -D @types/amqplib
```

## Environment Variables

```
# RabbitMQ
RABBITMQ_URL=amqp://user:password@localhost:5672
RABBITMQ_EXCHANGE=nestjs-starter
```

## Module Structure

### `src/app/config/rabbitmq.config.ts`

```typescript
registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
  exchange: process.env.RABBITMQ_EXCHANGE || 'nestjs-starter',
}))
```

### `src/common/rabbitmq/rabbitmq.module.ts`

Use `RabbitMQModule.forRootAsync` from `@golevelup/nestjs-rabbitmq`:

```typescript
RabbitMQModule.forRootAsync({
  useFactory: (config: ConfigService) => ({
    exchanges: [{ name: config.getOrThrow('rabbitmq.exchange'), type: 'topic' }],
    uri: config.getOrThrow('rabbitmq.url'),
    connectionInitOptions: { wait: false },
  }),
  inject: [ConfigService],
})
```

Export `RabbitMQModule` from the NestJS module so consumers can use `@RabbitSubscribe` and `AmqpConnection`.

### `src/common/rabbitmq/services/rabbitmq.service.ts`

Key implementation details:
- Inject `AmqpConnection` from `@golevelup/nestjs-rabbitmq`
- Expose:
  - `publish(exchange: string, routingKey: string, payload: unknown): Promise<void>` — wraps `this.amqpConnection.publish()`
  - `publishToQueue(queue: string, payload: unknown): Promise<void>` — direct queue publish

### `src/common/rabbitmq/interfaces/rabbitmq.interface.ts`

```typescript
export interface IRabbitMQPublishOptions {
  exchange: string;
  routingKey: string;
}
```

## CommonModule Wiring

Import the local `RabbitmqModule` (your wrapper) in `src/common/common.module.ts` and add to `exports`.

## Usage Example

```typescript
// Publishing from any service:
constructor(private readonly rabbitmq: RabbitmqService) {}

async notifyUserCreated(userId: string): Promise<void> {
  await this.rabbitmq.publish('nestjs-starter', 'user.created', { userId });
}

// Subscribing (in any module's service):
@RabbitSubscribe({
  exchange: 'nestjs-starter',
  routingKey: 'user.created',
  queue: 'user-created-queue',
})
async onUserCreated(msg: { userId: string }): Promise<void> {
  this.logger.log(`User created: ${msg.userId}`);
}
```

## Notes

- Run RabbitMQ locally: `docker run --rm -p 5672:5672 -p 15672:15672 rabbitmq:3-management`
- Management UI available at `http://localhost:15672` (guest/guest)
- `connectionInitOptions: { wait: false }` prevents app startup failure if broker is temporarily down
- For dead-letter queues, add `deadLetterExchange` and `deadLetterRoutingKey` to queue options
