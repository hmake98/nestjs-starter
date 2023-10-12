import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { PublicRequest } from 'src/core/decorators/public-request.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private ormIndicator: TypeOrmHealthIndicator,
    private healthCheckService: HealthCheckService,
  ) {}

  @Get()
  @HealthCheck()
  @PublicRequest()
  public async getHealth() {
    return this.healthCheckService.check([
      () => this.ormIndicator.pingCheck('database', { timeout: 1500 }),
    ]);
  }
}
