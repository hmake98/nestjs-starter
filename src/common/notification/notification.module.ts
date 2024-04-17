import { Module } from '@nestjs/common';
import { join } from 'path';
import { EmailService } from './services/email.service';
import { NotificationController } from './controllers/notification.controller';
import { TextMessageService } from './services/text-message.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as AWS from '@aws-sdk/client-ses';
import { EmailWorker } from './workers/email.worker';

@Module({
  controllers: [NotificationController],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: createTransport({
          SES: {
            ses: new AWS.SES({
              region: configService.get<string>('aws.region'),
              credentials: {
                accessKeyId: configService.get<string>('aws.accessKey'),
                secretAccessKey: configService.get<string>('aws.secretKey'),
              },
            }),
            AWS,
          },
        }).transporter,
        defaults: {
          from: `${configService.get('app.name')} ${configService.get<string>(
            'aws.ses.sourceEmail',
          )}`,
        },
        template: {
          dir: join(__dirname, '../../templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService, EmailWorker, TextMessageService],
  exports: [EmailService, EmailWorker, TextMessageService],
})
export class NotificationModule {}
