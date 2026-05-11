import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    HealthCheck,
    HealthCheckResult,
    HealthCheckService,
} from '@nestjs/terminus';

import { DatabaseService } from 'src/common/database/services/database.service';
import { PublicRoute } from 'src/common/request/decorators/public.decorator';

@ApiTags('health')
@PublicRoute()
@Controller({ path: '/health', version: VERSION_NEUTRAL })
export class HealthController {
    constructor(
        private readonly healthCheckService: HealthCheckService,
        private readonly databaseService: DatabaseService
    ) {}

    @Get()
    @HealthCheck()
    getHealth(): Promise<HealthCheckResult> {
        return this.healthCheckService.check([
            () => this.databaseService.isHealthy(),
        ]);
    }
}
