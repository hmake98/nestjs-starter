import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { HelperModule } from 'src/common/helper/helper.module';
import { BullModule } from '@nestjs/bull';
import { Queues } from '../../app/app.constant';

@Module({
  imports: [
    HelperModule,
    BullModule.registerQueue({
      name: Queues.Notification,
    }),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
