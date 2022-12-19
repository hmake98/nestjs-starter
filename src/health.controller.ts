import { Controller, Get, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { AllowUnauthorizedRequest } from './core/decorators/allow.decorator';

@Controller('health')
export class HealthController {
  constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}
  @AllowUnauthorizedRequest()
  @Get('/')
  public async getHealth() {
    try {
      await this.sequelize.authenticate();
      return { status: true };
    } catch (e) {
      return { status: false };
    }
  }
}
