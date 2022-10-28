import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { PrismaService, TokenService, FileService } from 'src/shared';
import { APP_GUARD } from '@nestjs/core';
import { ClientAuthGuard, RolesGuard } from 'src/core';

@Module({
  imports: [ConfigModule],
  controllers: [PostController],
  providers: [
    PostService,
    TokenService,
    FileService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ClientAuthGuard,
    }, {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
  exports: [PostService],
})
export class PostModule { }
