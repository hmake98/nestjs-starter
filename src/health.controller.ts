import { Controller, Get } from '@nestjs/common';
import { AllowUnauthorizedRequest } from './core/decorators/allow.decorator';
import { PrismaService } from './shared';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) { }
  
  @AllowUnauthorizedRequest()
  @Get('/')
  public async getHealth() {
    try {
      await this.prisma.$connect();
      return { connected: true };
    } catch (e) {
      return { connected: false, e };
    }
  }
}
