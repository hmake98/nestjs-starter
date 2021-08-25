import { Injectable, Scope } from '@nestjs/common';
import { SES } from 'aws-sdk';
import { existsSync } from 'fs';
import { join } from 'path';
import { TEMPLATES } from 'src/common/constant';
import { ConfigService } from 'src/config/config.service';
import { readFilePromise } from 'src/utils/utils';
import { replaceAll } from '../../utils/utils';

@Injectable({ scope: Scope.DEFAULT })
export class EmailService {
  private emailService: SES;
  private sourceEmail: string;

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
      _content = replaceAll(_content, data);
      console.log(_content);
      // this.emailService
      //   .sendEmail({
      //     Source: this.sourceEmail,
      //     Destination: {
      //       ToAddresses: emails,
      //     },
      //     Message: {
      //       Body: {
      //         Html: {
      //           Charset: 'UTF-8',
      //           Data: _content,
      //         },
      //       },
      //       Subject: {
      //         Charset: 'UTF-8',
      //         Data: subjectData,
      //       },
      //     },
      //   })
      //   .promise()
      //   .catch((e) => console.log(e));
    } catch (e) {
      throw new Error(e);
    }
  }
}
