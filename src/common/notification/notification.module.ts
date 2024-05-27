import { join } from 'path';

import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SES } from '@aws-sdk/client-ses';

import { HelperModule } from '../helper/helper.module';

import { EmailWorker } from './workers/email.worker';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { TextMessageService } from './services/text-message.service';

@Module({
  controllers: [NotificationController],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          SES: new SES({
            region: configService.get<string>('aws.region'),
            credentials: {
              accessKeyId: configService.get<string>('aws.accessKey'),
              secretAccessKey: configService.get<string>('aws.secretKey'),
            },
          }),
        },
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
    HelperModule,
  ],
  providers: [EmailWorker, TextMessageService, NotificationService],
  exports: [EmailWorker, TextMessageService, NotificationService],
})
export class NotificationModule {}
