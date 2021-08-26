import { Injectable, Logger } from '@nestjs/common';
import { SES } from 'aws-sdk';
import { existsSync } from 'fs';
import { join } from 'path';
import { ConfigService } from 'src/config/config.service';
import { readFilePromise } from 'src/utils/helper';
import * as _ from 'lodash';

@Injectable()
export class EmailService {
  private emailService: SES;
  private sourceEmail: string;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: ConfigService) {
    const awsConfig = this.config.get('aws');
    this.sourceEmail = this.config.get('sourceEmail');
    this.emailService = new SES(awsConfig);
  }

  public async sendEmail(template: string, emails: string[], data: any, subjectData: string) {
    try {
      let templatePath = join(__dirname, '../../templates/', `${template}.html`);
      if (!existsSync(templatePath)) {
        templatePath = join(__dirname, '../templates/', `${template}.html`);
      }
      let _content = await readFilePromise(templatePath);
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
    } catch (e) {
      this.logger.error(e);
    }
  }
}
