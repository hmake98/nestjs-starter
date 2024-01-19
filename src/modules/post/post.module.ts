import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { HelperModule } from 'src/common/helper/helper.module';

@Module({
  imports: [HelperModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
