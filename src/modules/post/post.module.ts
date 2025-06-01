import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/common/database/database.module';
import { HelperModule } from 'src/common/helper/helper.module';

import { PostPublicController } from './controllers/posts.public.controller';
import { PostService } from './services/post.service';

@Module({
    imports: [HelperModule, DatabaseModule],
    controllers: [PostPublicController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
