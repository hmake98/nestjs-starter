import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { SES } from 'aws-sdk';
import { join } from 'path';
import * as _ from 'lodash';
import { readFileSync } from 'fs';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);
  private emailService: SES;
  private sourceEmail: string;

  constructor(private configService: ConfigService) {
    this.sourceEmail = this.configService.get('aws_source_email');
    this.emailService = new SES({
      accessKeyId: this.configService.get('aws_access_key'),
      secretAccessKey: this.configService.get('aws_secret_key'),
      region: this.configService.get('aws_region'),
    });
  }

  public async processEmail(
    template: string,
    emails: string[],
    data: any,
    subjectData: string,
  ) {
    const templatePath = join(__dirname, '..', 'templates', `${template}.html`);
    let _content = readFileSync(templatePath, 'utf-8');
    const compiled = _.template(_content);
    _content = compiled(data);
    this.emailService
      .sendEmail({
        Source: this.sourceEmail,
        Destination: {
          ToAddresses: emails,
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: _content,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subjectData,
          },
        },
      })
      .promise()
      .catch((e) => this.logger.error(e));
  }
}
