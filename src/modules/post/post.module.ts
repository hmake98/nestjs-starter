import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { PrismaService, TokenService, FileService } from 'src/shared';

@Module({
  imports: [ConfigModule],
  controllers: [PostController],
  providers: [PostService, TokenService, FileService, PrismaService],
  exports: [PostService],
})
export class PostModule {}
