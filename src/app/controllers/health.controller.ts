import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { DatabaseService } from 'src/common/database/services/database.service';
import { PublicRoute } from 'src/common/request/decorators/request.public.decorator';

@ApiTags('health')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/health',
})
export class HealthController {
    constructor(
        private readonly healthCheckService: HealthCheckService,
        private readonly databaseService: DatabaseService
    ) {}

    @Get()
    @HealthCheck()
    @PublicRoute()
    public async getHealth() {
        return this.healthCheckService.check([
            () => this.databaseService.isHealthy(),
        ]);
    }
}
