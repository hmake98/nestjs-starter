import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaService } from 'src/common/services/prisma.service';
import { PublicRequest } from 'src/core/decorators/public.request.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('/health')
  @HealthCheck()
  @PublicRequest()
  public async getHealth() {
    return this.healthCheckService.check([
      () => this.prismaService.isHealthy(),
    ]);
  }
}
