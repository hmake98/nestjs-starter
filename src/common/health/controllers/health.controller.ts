import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { PrismaService } from 'src/common/database/services/prisma.service';
import { PublicRoute } from 'src/common/request/decorators/request.public.decorator';

@Controller({
    version: VERSION_NEUTRAL,
    path: '/health',
})
export class HealthController {
    constructor(
        private readonly healthCheckService: HealthCheckService,
        private readonly prismaService: PrismaService
    ) {}

    @Get()
    @HealthCheck()
    @PublicRoute()
    public async getHealth() {
        return this.healthCheckService.check([
            () => this.prismaService.isHealthy(),
        ]);
    }
}
