import { Controller, Get } from '@nestjs/common';
import { Public } from '../../core/decorators/public-request.decorator';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private ormIndicator: TypeOrmHealthIndicator,
    private healthCheckService: HealthCheckService,
  ) {}

  @Get()
  @HealthCheck()
  @Public()
  public async getHealth() {
    return this.healthCheckService.check([
      () => this.ormIndicator.pingCheck('database', { timeout: 1500 }),
    ]);
  }
}
