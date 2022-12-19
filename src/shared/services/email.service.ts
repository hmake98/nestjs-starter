import { Injectable, Logger } from '@nestjs/common';
import { SES } from 'aws-sdk';
import { join } from 'path';
import { helpers } from '../../utils/helpers';
import * as _ from 'lodash';
import { awsConfig } from 'src/utils/common';

@Injectable()
export class EmailService {
  private emailService: SES;
  private sourceEmail: string;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.sourceEmail = awsConfig.sourceEmail;
    this.emailService = new SES({
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
      region: awsConfig.region,
    });
  }

  public async processEmail(
    template: string,
    emails: string[],
    data: any,
    subjectData: string,
  ) {
    const templatePath = join(__dirname, '..', 'templates', `${template}.html`);
    let _content = await helpers.readFilePromise(templatePath);
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
