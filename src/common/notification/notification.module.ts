import { Module } from '@nestjs/common';
import { EmailService } from './services/mailer.service';
import { FirebaseService } from './services/firebase.service';
import { NotificationController } from './controllers/notification.controller';
import { AwsSNSService } from './services/aws.sns.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  controllers: [NotificationController],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          type: 'ses',
          options: {
            accessKeyId: configService.get<string>('aws.accessKey'),
            secretAccessKey: configService.get<string>('aws.secretKey'),
            region: configService.get<string>('aws.region'),
          },
        },
        defaults: {
          from: configService.get<string>('aws.sourceEmail'),
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
