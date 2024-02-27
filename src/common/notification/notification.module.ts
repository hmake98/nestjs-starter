import { Module } from '@nestjs/common';
import { join } from 'path';
import { EmailService } from './services/email.service';
import { FirebaseService } from './services/firebase.service';
import { NotificationController } from './controllers/notification.controller';
import { AwsSNSService } from './services/aws.sns.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';

@Module({
  controllers: [NotificationController],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: createTransport({
          SES: {
            ses: new aws.SES({
              region: configService.get<string>('aws.region'),
              credentials: {
                accessKeyId: configService.get<string>('aws.accessKey'),
                secretAccessKey: configService.get<string>('aws.secretKey'),
              },
            }),
            aws,
          },
        }).transporter,
        defaults: {
          from: `${configService.get('app.name')} ${configService.get<string>(
            'aws.sourceEmail',
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
  providers: [EmailService, FirebaseService, AwsSNSService],
})
export class NotificationModule {}
