import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';
import { UserRepository } from '../../shared/repository';
import { TokenService } from 'src/shared/services/token.service';
import { ConfigModule } from 'src/config/config.module';
import { DatabaseModule } from 'src/database/database.module';
import { FileService } from 'src/shared/services/file.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [UserController],
  exports: [UserService],
  providers: [
    UserService,
    TokenService,
    FileService,
    {
      provide: UserRepository,
      useFactory: (connection: Connection) => connection.getCustomRepository(UserRepository),
      inject: [Connection],
    },
  ],
})
export class UserModule {}
