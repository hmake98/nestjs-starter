import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';
import { PostRepository, UserRepository } from '../../shared/repository';
import { TokenService } from 'src/shared/services/token.service';
import { ConfigModule } from 'src/config/config.module';
import { DatabaseModule } from 'src/database/database.module';
import { FileService } from 'src/shared/services/file.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [PostController],
  exports: [PostService],
  providers: [
    PostService,
    TokenService,
    FileService,
    {
      provide: PostRepository,
      useFactory: (connection: Connection) => connection.getCustomRepository(PostRepository),
      inject: [Connection],
    },
    {
      provide: UserRepository,
      useFactory: (connection: Connection) => connection.getCustomRepository(UserRepository),
      inject: [Connection],
    },
  ],
})
export class PostModule {}
