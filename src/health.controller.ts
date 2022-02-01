import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}
  @Get('/health')
  public async getHealth() {
    const connection = await this.connection.readyState;
    return { status: connection };
  }
}
