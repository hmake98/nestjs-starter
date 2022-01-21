import { DatabaseModule } from 'src/database/database.module';
import { Connection } from 'typeorm';
import { ConfigModule } from 'src/config/config.module';
import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { UserRepository } from 'src/shared/repository';
import { GoogleController } from './google.controller';

@Module({
  imports: [ConfigModule,DatabaseModule],
  controllers: [GoogleController],
  providers: [
    GoogleService,
    {
      provide: UserRepository,
      useFactory: (connection: Connection) => connection.getCustomRepository(UserRepository),
      inject: [Connection],
    },
  ],
})
export class GoogleModule {}
