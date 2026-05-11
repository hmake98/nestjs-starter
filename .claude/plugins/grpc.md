# gRPC Plugin

Adds a gRPC microservice transport alongside the existing HTTP server (hybrid application). Use for high-performance internal service-to-service communication with strongly-typed contracts via protobuf.

## Packages

```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

(`@nestjs/microservices` is already available as a peer dep of NestJS — no separate install needed.)

## Environment Variables

```
# gRPC
GRPC_HOST=0.0.0.0
GRPC_PORT=5000
GRPC_PACKAGE=nestjs.starter
```

## Module Structure

### `src/app/config/grpc.config.ts`

```typescript
registerAs('grpc', () => ({
  host: process.env.GRPC_HOST || '0.0.0.0',
  port: parseInt(process.env.GRPC_PORT || '5000', 10),
  package: process.env.GRPC_PACKAGE || 'nestjs.starter',
}))
```

### Proto file — `src/common/grpc/proto/health.proto`

Create a starter proto for health checks:

```proto
syntax = "proto3";
package nestjs.starter;

service HealthService {
  rpc Check (HealthCheckRequest) returns (HealthCheckResponse);
}

message HealthCheckRequest {}
message HealthCheckResponse {
  string status = 1;
}
```

### `src/common/grpc/grpc.module.ts`

Standard NestJS module. Register config with `ConfigModule.forFeature(grpcConfig)`.
Provide and export: `GrpcClientService`.

### `src/common/grpc/services/grpc-client.service.ts`

A helper service for creating typed gRPC client proxies:

- Inject `ConfigService`
- Expose: `createClient(protoPath: string, packageName: string, serviceUrl: string): ClientGrpc` — wraps `ClientProxyFactory.create()` with `Transport.GRPC`

### `src/common/grpc/interfaces/grpc.interface.ts`

```typescript
export interface IGrpcClientOptions {
  protoPath: string;
  package: string;
  url: string;
}
```

## Hybrid App Wiring in `src/main.ts`

After generating the module, also edit `src/main.ts` to connect the gRPC microservice:

```typescript
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

// After app.create():
const grpcConfig = app.get(ConfigService);
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.GRPC,
  options: {
    host: grpcConfig.getOrThrow('grpc.host'),
    port: grpcConfig.getOrThrow<number>('grpc.port'),
    package: grpcConfig.getOrThrow('grpc.package'),
    protoPath: join(__dirname, '../src/common/grpc/proto/health.proto'),
  },
});
await app.startAllMicroservices();
```

## CommonModule Wiring

Import `GrpcModule` in `src/common/common.module.ts` and add to `exports`.

## Usage Example

```typescript
// Implementing a gRPC controller:
@Controller()
@GrpcMethod('HealthService', 'Check')
async check(): Promise<{ status: string }> {
  return { status: 'SERVING' };
}

// Calling a remote gRPC service from a service:
const client = this.grpcClient.createClient(protoPath, 'other.service', 'localhost:5001');
const stub = client.getService<OtherServiceStub>('OtherService');
```

## Notes

- Proto files must be compiled before the app starts — the `@grpc/proto-loader` package handles this at runtime (no separate `protoc` step needed)
- In Docker, set `GRPC_HOST=0.0.0.0` to bind on all interfaces
- For mTLS, pass `credentials` to the server options
- Consider generating TypeScript types from protos with `ts-proto` for full type safety
