import { Injectable, Scope } from '@nestjs/common';
import { SES } from 'aws-sdk';
import { existsSync } from 'fs';
import { join } from 'path';
import { ConfigService } from 'src/config/config.service';
import { readFilePromise } from 'src/utils/utils';

@Injectable({ scope: Scope.DEFAULT })
export class EmailService {
  private emailService: SES;
  private sourceEmail: string;

  constructor(private readonly config: ConfigService) {
    const awsConfig = this.config.get('aws');
    this.sourceEmail = this.config.get('sourceEmail');
    this.emailService = new SES(awsConfig);
  }
}
