import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

@Injectable()
export class EmailService {
  private sourceEmail: string;
  private readonly sesClient: SESClient;

  constructor(private configService: ConfigService) {
    this.sourceEmail = this.configService.get('aws.sourceEmail');
    this.sesClient = new SESClient({
      credentials: {
        accessKeyId: configService.get('aws.accessKey'),
        secretAccessKey: configService.get('aws.secretKey'),
      },
      region: configService.get('aws.region'),
    });
  }

  private populateTemplate(
    template: string,
    data: Record<string, any>,
  ): string {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        template = template.replace(
          new RegExp(`{{\\s*${key}\\s*}}`, 'g'),
          data[key],
        );
      }
    }
    return template;
  }

  async sendEmail(
    toEmail: string,
    subject: string,
    templateFile: string,
    templateData: Record<string, any>,
  ): Promise<void> {
    const template = readFileSync(templateFile, 'utf8');

    const emailParams = {
      Destination: {
        ToAddresses: [toEmail],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: this.populateTemplate(template, templateData),
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: this.sourceEmail,
    };

    try {
      const sendEmailCommand = new SendEmailCommand(emailParams);
      await this.sesClient.send(sendEmailCommand);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
