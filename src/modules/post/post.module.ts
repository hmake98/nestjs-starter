import { Module } from '@nestjs/common';

import { HelperModule } from 'src/common/helper/helper.module';

import { PostController } from './controllers/posts.controller';
import { PostService } from './services/post.service';

@Module({
  imports: [HelperModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
