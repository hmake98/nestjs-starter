import { Controller, Get } from '@nestjs/common';
import { Connection } from 'typeorm';

@Controller()
export class HealthController {
  constructor(private readonly connection: Connection) {}
  @Get('/health')
  public async getHealth() {
    const connection = await this.connection.isConnected;
    return { status: connection };
  }
}
