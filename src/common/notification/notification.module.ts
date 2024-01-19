import { Module } from '@nestjs/common';
import { AwsSESService } from './services/aws.ses.service';
import { FirebaseService } from './services/firebase.service';
import { NotificationController } from './controllers/notification.controller';
import { AwsSNSService } from './services/aws.sns.service';

@Module({
  controllers: [NotificationController],
  imports: [],
  providers: [AwsSESService, FirebaseService, AwsSNSService],
})
export class NotificationModule {}
