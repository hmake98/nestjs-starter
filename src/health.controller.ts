import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './shared';

@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) { }
  @Get('/health')
  public async getHealth() {
    try {
      const connection = await this.prisma.$connect();
      return { status: true };
    } catch (e) {
      return { status: false, error: e };
    }
  }
}
