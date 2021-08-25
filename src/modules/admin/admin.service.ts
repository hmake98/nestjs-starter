import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class AdminService {
  public limit: number;

  constructor(private readonly configService: ConfigService) {
    this.limit = this.configService.get('limit');
  }
}
