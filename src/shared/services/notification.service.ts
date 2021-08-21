import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';

@Injectable({ scope: Scope.DEFAULT })
export class NotificationService {
  constructor(private readonly config: ConfigService) {}
}
