import { Module } from '@nestjs/common';
import { AwsSESService } from './services/aws.ses.service';
import { FirebaseService } from './services/firebase.service';
import { NotificationController } from './controllers/notification.controller';

@Module({
  controllers: [NotificationController],
  imports: [],
  providers: [AwsSESService, FirebaseService],
})
export class NotificationModule {}
