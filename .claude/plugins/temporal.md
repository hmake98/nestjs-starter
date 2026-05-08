# Temporal Plugin

Durable workflow engine for reliable multi-step background jobs, sagas, and scheduled processes. Replaces ad-hoc retry logic with versioned, observable workflows.

## Packages

```bash
npm install nestjs-temporal-core @temporalio/client @temporalio/worker @temporalio/workflow @temporalio/activity
```

`nestjs-temporal-core` provides NestJS-native decorators and module integration. The `@temporalio/*` packages provide the underlying Temporal SDK.

## Environment Variables

```
# Temporal
TEMPORAL_ADDRESS=localhost:7233
TEMPORAL_NAMESPACE=default
TEMPORAL_TASK_QUEUE=nestjs-starter
```

## Module Structure

### `src/app/config/temporal.config.ts`

```typescript
registerAs('temporal', () => ({
  address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
  namespace: process.env.TEMPORAL_NAMESPACE || 'default',
  taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'nestjs-starter',
}))
```

### `src/common/temporal/temporal.module.ts`

Use `TemporalModule.forRootAsync` from `nestjs-temporal-core`:

```typescript
TemporalModule.forRootAsync({
  useFactory: (config: ConfigService) => ({
    connection: {
      address: config.getOrThrow('temporal.address'),
    },
    namespace: config.getOrThrow('temporal.namespace'),
    taskQueue: config.getOrThrow('temporal.taskQueue'),
    worker: {
      workflowsPath: require.resolve('./workflows'),
    },
  }),
  inject: [ConfigService],
})
```

Also provide and export: `TemporalService`.

### `src/common/temporal/services/temporal.service.ts`

Key implementation details:
- Inject `TemporalClient` from `nestjs-temporal-core`
- Expose:
  - `startWorkflow<T>(workflowName: string, args: unknown[], options: IStartWorkflowOptions): Promise<string>` — returns the workflow run ID via `this.client.workflow.start()`
  - `getHandle(workflowId: string)` — returns a workflow handle for querying/signalling
  - `cancelWorkflow(workflowId: string): Promise<void>` — cancels a running workflow

### `src/common/temporal/workflows/index.ts`

Starter workflow file (required by `workflowsPath`):

```typescript
import { proxyActivities } from '@temporalio/workflow';

// Stub — replace with real workflow functions
export async function exampleWorkflow(name: string): Promise<string> {
  return `Hello ${name} from Temporal!`;
}
```

### `src/common/temporal/interfaces/temporal.interface.ts`

```typescript
export interface IStartWorkflowOptions {
  workflowId: string;
  taskQueue?: string;
  args?: unknown[];
}
```

## CommonModule Wiring

Import `TemporalModule` (the local wrapper) in `src/common/common.module.ts` and add to `exports`.

## Usage Example

```typescript
// In any feature service:
constructor(private readonly temporal: TemporalService) {}

async triggerOnboarding(userId: string): Promise<void> {
  await this.temporal.startWorkflow(
    'onboardingWorkflow',
    [{ userId }],
    { workflowId: `onboarding-${userId}` },
  );
}

// Defining an activity (injectable service with @Activity() decorator):
@Injectable()
export class EmailActivities {
  @Activity()
  async sendWelcomeEmail(userId: string): Promise<void> {
    // called by Temporal worker
  }
}
```

## Notes

- Temporal server is required — run locally with Docker: `docker run --rm -p 7233:7233 temporalio/auto-setup:latest`
- Workflow functions in `workflows/index.ts` must be pure — no NestJS DI, no async I/O outside Temporal primitives
- Activities CAN be NestJS injectable services decorated with `@Activity()` from `nestjs-temporal-core`
- For production, use [Temporal Cloud](https://temporal.io/cloud) — set `TEMPORAL_ADDRESS` to the cloud endpoint with mTLS certs
- See the `nestjs-temporal-core` docs at https://www.npmjs.com/package/nestjs-temporal-core for full decorator API
