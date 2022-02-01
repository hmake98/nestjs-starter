import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Module } from '@nestjs/common';
import { TokenService } from 'src/shared/services/token.service';
import { ConfigModule } from 'src/config/config.module';
import { FileService } from 'src/shared/services/file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostSchema } from 'src/database/schemas/post.schema';

@Module({
  imports: [ConfigModule, MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }])],
  controllers: [PostController],
  exports: [PostService],
  providers: [PostService, TokenService, FileService],
})
export class PostModule {}
